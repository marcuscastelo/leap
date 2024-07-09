'use client'

import axios from 'axios'

export default function Page() {
  const handleReceived = async () => {
    const response = await axios.post(
      'https://76bm8iyk24.execute-api.us-east-1.amazonaws.com/v1/integrations/streamlabs',
      '',
      {
        params: {
          name: 'Fishstickslol',
          message: 'I love Fishsticks!',
          identifier: 'fishingthesticks@gmail.com',
          amount: 10,
          currency: 'USD',
        },
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.8',
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhYnJpZXVsd0BnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoie1wiTmFtZVwiOlwiR2FicmllbCBBbHZlc1wiLFwiRW1haWxcIjpcImdhYnJpZXVsd0BnbWFpbC5jb21cIixcIklkXCI6Mzk5MDJ9IiwibmJmIjoxNzIwNTQ3Mjg3LCJleHAiOjE3MjMxMzkyODcsImlhdCI6MTcyMDU0NzI4N30.S3tnQ_wG55YfHfAAkecch70bzgAsSGVxXxQ-9DrR8l0',
          'content-length': '0',
          origin: 'https://pixgg.com',
          priority: 'u=1, i',
          referer: 'https://pixgg.com/',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Brave";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'sec-gpc': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
      },
    )

    console.log(response)
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={handleReceived}>
        Recebido!
      </button>
    </div>
  )
}
