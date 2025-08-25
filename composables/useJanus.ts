import { ref, reactive } from 'vue'

export interface JanusConfig {
  url: string
  roomId?: number
  publisherId?: number
}

export interface Mountpoint {
  id: number
  description: string
  roomId: number | null
  createdAt: string
}

export const useJanus = () => {
  const isConnected = ref(false)
  const isPublishing = ref(false)
  const isPlaying = ref(false)
  const localStream = ref<MediaStream | null>(null)
  const remoteStream = ref<MediaStream | null>(null)
  const error = ref<string | null>(null)
  
  let janus: any = null
  let videoroomPlugin: any = null
  let streamingPlugin: any = null

  const connect = async (config: JanusConfig) => {
    try {
      error.value = null
      
      // Initialize Janus
      janus = new (window as any).Janus({
        server: config.url,
        success: () => {
          isConnected.value = true
          console.log('Janus connected')
        },
        error: (err: any) => {
          error.value = `Connection error: ${err}`
          console.error('Janus connection error:', err)
        },
        destroyed: () => {
          isConnected.value = false
          console.log('Janus destroyed')
        }
      })
    } catch (err) {
      error.value = `Failed to connect: ${err}`
      console.error('Connection failed:', err)
    }
  }

  const joinRoom = async (roomId: number) => {
    if (!janus) {
      error.value = 'Not connected to Janus'
      return
    }

    try {
      await new Promise((resolve, reject) => {
        janus.attach({
          plugin: 'janus.plugin.videoroom',
          success: (pluginHandle: any) => {
            videoroomPlugin = pluginHandle
            console.log('VideoRoom plugin attached')
            
            // Join the room
            videoroomPlugin.send({
              message: {
                request: 'join',
                room: roomId,
                ptype: 'publisher'
              }
            })
            
            videoroomPlugin.onmessage = (msg: any, jsep: any) => {
              if (jsep) {
                videoroomPlugin.handleRemoteJsep({ jsep })
              }
              if (msg.event) {
                if (msg.event === 'joined') {
                  console.log('Joined room:', msg.room)
                  resolve(true)
                } else if (msg.event === 'event') {
                  console.log('Room event:', msg)
                }
              }
            }
            
            videoroomPlugin.onremotetrack = (track: any, mid: any, on: any) => {
              console.log('Remote track:', track, mid, on)
            }
          },
          error: (err: any) => {
            error.value = `Plugin attachment error: ${err}`
            reject(err)
          }
        })
      })
    } catch (err) {
      error.value = `Failed to join room: ${err}`
      console.error('Join room failed:', err)
    }
  }

  const publish = async () => {
    if (!videoroomPlugin) {
      error.value = 'Not in a room'
      return
    }

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      localStream.value = stream
      
      // Publish stream
      videoroomPlugin.createOffer({
        tracks: [
          { type: 'video', capture: stream.getVideoTracks()[0] },
          { type: 'audio', capture: stream.getAudioTracks()[0] }
        ],
        success: (jsep: any) => {
          videoroomPlugin.send({
            message: {
              request: 'publish',
              audiocodec: 'opus',
              videocodec: 'vp8'
            },
            jsep
          })
        },
        error: (err: any) => {
          error.value = `Failed to create offer: ${err}`
        }
      })
      
      videoroomPlugin.onmessage = (msg: any, jsep: any) => {
        if (jsep) {
          videoroomPlugin.handleRemoteJsep({ jsep })
        }
        if (msg.event) {
          if (msg.event === 'event') {
            if (msg.publishers) {
              console.log('Publishers:', msg.publishers)
            }
            if (msg.room) {
              console.log('Room info:', msg.room)
            }
          }
        }
      }
      
      isPublishing.value = true
      
      // Register mountpoint
      await $fetch('/api/mountpoints', {
        method: 'POST',
        body: {
          description: `Stream from Room ${Math.floor(Math.random() * 1000)}`,
          roomId: Math.floor(Math.random() * 1000)
        }
      })
      
    } catch (err) {
      error.value = `Failed to publish: ${err}`
      console.error('Publish failed:', err)
    }
  }

  const playStream = async (mountpointId: number) => {
    if (!janus) {
      error.value = 'Not connected to Janus'
      return
    }

    try {
      await new Promise((resolve, reject) => {
        janus.attach({
          plugin: 'janus.plugin.streaming',
          success: (pluginHandle: any) => {
            streamingPlugin = pluginHandle
            console.log('Streaming plugin attached')
            
            // List available streams
            streamingPlugin.send({
              message: {
                request: 'list'
              }
            })
            
            streamingPlugin.onmessage = (msg: any, jsep: any) => {
              if (jsep) {
                streamingPlugin.handleRemoteJsep({ jsep })
              }
              if (msg.list) {
                console.log('Available streams:', msg.list)
                // Find the stream for our mountpoint
                const stream = msg.list.find((s: any) => s.id === mountpointId)
                if (stream) {
                  // Watch the stream
                  streamingPlugin.send({
                    message: {
                      request: 'watch',
                      id: mountpointId
                    }
                  })
                }
              }
              if (msg.event) {
                if (msg.event === 'event') {
                  console.log('Streaming event:', msg)
                }
              }
            }
            
            streamingPlugin.onremotetrack = (track: any, mid: any, on: any) => {
              console.log('Remote streaming track:', track, mid, on)
              if (on && track) {
                remoteStream.value = new MediaStream([track])
                isPlaying.value = true
              }
            }
            
            resolve(true)
          },
          error: (err: any) => {
            error.value = `Streaming plugin error: ${err}`
            reject(err)
          }
        })
      })
    } catch (err) {
      error.value = `Failed to play stream: ${err}`
      console.error('Play stream failed:', err)
    }
  }

  const stopStream = () => {
    if (streamingPlugin) {
      streamingPlugin.send({
        message: {
          request: 'stop'
        }
      })
      isPlaying.value = false
      remoteStream.value = null
    }
  }

  const leaveRoom = () => {
    if (localStream.value) {
      localStream.value.getTracks().forEach(track => track.stop())
      localStream.value = null
    }
    
    if (videoroomPlugin) {
      videoroomPlugin.send({
        message: {
          request: 'leave'
        }
      })
      videoroomPlugin.detach()
      videoroomPlugin = null
    }
    
    isPublishing.value = false
  }

  const disconnect = () => {
    leaveRoom()
    stopStream()
    
    if (janus) {
      janus.destroy()
      janus = null
    }
    
    isConnected.value = false
  }

  return {
    // State
    isConnected,
    isPublishing,
    isPlaying,
    localStream,
    remoteStream,
    error,
    
    // Methods
    connect,
    joinRoom,
    publish,
    playStream,
    stopStream,
    leaveRoom,
    disconnect
  }
}
