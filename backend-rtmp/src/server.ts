import NodeMediaServer from 'node-media-server'

type ConstructorFirstParamType<T> = T extends new (
  arg1: infer U,
  ...args: any[]
) => any
  ? U
  : never

type Config = ConstructorFirstParamType<typeof NodeMediaServer>

const config: Config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 80,
    mediaroot: './media',
    allow_origin: '*',
  },
  https: {
    port: 443,
    cert: '/etc/letsencrypt/live/leap-rtmp.onrender.com/fullchain.pem',
    key: '/etc/letsencrypt/live/leap-rtmp.onrender.com/privkey.pem',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      // HLS encoding
      {
        app: 'live',
        vc: 'copy',
        ac: 'copy',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
      },
      // 	// Save the video as an mp4 for later viewing
      // 	{
      // 		app: 'live',
      // 		mp4: true,
      // 		mp4Flags: '[movflags=frag_keyframe+empty_moov]',
      // 	},
    ],
  },
  // // Allow live streaming to be done at native, 720p, 480p and 360p
  // fission: {
  // 	ffmpeg:  '/usr/bin/ffmpeg',
  // 	tasks: [
  // 		{
  // 			rule: 'live/*',
  // 			model: [
  // 				{
  // 					ab: '128k',
  // 					vb: '1500k',
  // 					vs: '1280x720',
  // 					vf: '30',
  // 				},
  // 				{
  // 					ab: '96k',
  // 					vb: '1000k',
  // 					vs: '854x480',
  // 					vf: '24',
  // 				},
  // 				{
  // 					ab: '96k',
  // 					vb: '600k',
  // 					vs: '640x360',
  // 					vf: '20',
  // 				},
  // 			],
  // 		},
  // 	],
  // },
}

const nodeMediaServer = new NodeMediaServer(config)
nodeMediaServer.run()
