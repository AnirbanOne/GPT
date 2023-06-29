import axios from "axios"

export default async function handler(req, res) {
    if(req.method !== 'POST'){
        res.status(405).json({message: 'Method should be POST'})
    } else {
        try {
            const {body} = req;
            const url = "https://api.openai.com/v1/chat/completions";
            const headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAPI_API_KEY}`,
            };
        
            

            const response = await axios.post(url, body, { headers: headers })

            res.status(200).json(response.data)
        }
     catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something is wrong"})
    }
}
}