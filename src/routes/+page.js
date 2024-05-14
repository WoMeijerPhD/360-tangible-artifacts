// @ts-nocheck
/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    // fetch the data
    const response = await fetch('https://raw.githubusercontent.com/WoMeijerPhD/360-tangible-artifacts/main/README.md');

    let content = await response.text();

    // check if the response is ok
    if (!response.ok) {
        // return the error status
        return {
            status: response.status,
            error: new Error(`Could not load data: ${content}`)
        };
    }
    // return the 
    return {
   
            content
        
    };
}