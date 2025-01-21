async function verifyJWT(token : string) {
    const url = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/trpc/verifyJWT`;
  
    const requestBody = {
      token: token,
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Failed to verify JWT');
      }
  
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
export default verifyJWT;