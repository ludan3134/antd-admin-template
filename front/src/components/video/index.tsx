import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css' // 引入 Video.js 样式
import Player from 'video.js/dist/types/player'

interface Props {
  src: string // HLS 流的 URL
}

const VideoPlayer: React.FC<Props> = ({ src }) => {
  const playerRef = useRef<Player>()
  useEffect(() => {
    // 初始化 Video.js 播放器
    playerRef.current = videojs('my-player', {
      controls: true,
      preload: 'auto',
      sources: [
        {
          src: src,
          // type: 'application/x-mpegURL', // HLS MIME 类型
        },
      ],
    })
    // 清理函数
    return () => {
      if (playerRef.current) {
        playerRef.current?.dispose()
      }
    }
  }, [src])


  return (
    <div>
      <video id="my-player" className="video-js vjs-default-skin"></video>
    </div>
  )
}

export default VideoPlayer






