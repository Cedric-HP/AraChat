const useFetch = () => {

    async function getChannel (id: number) {
        try {
            const res =  
                await fetch(`https://grippy.learn.pierre-godino.com`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id
                    })
                }
            )
            if(!res.ok)
                throw new Error(`Http error. status: ${res.status}`)

            console.log("SA MARCHE"+res)
            const data = res.json()
            return data
        }
        catch(err) {
            console.error(err)
        }
    }

    return {
        getChannel: getChannel
    }
  };

  
  export default useFetch;