import { Client, Functions } from "appwrite";
import { useEffect, useState } from "react";

const client = new Client();
const functions = new Functions(client);

function requestPayment(name, phone, price) {
    const uid = "UID" + Date.now();

    const body = JSON.stringify({
        name: name,
        phone: phone,
        price: price,
        user_id: uid,
        redirect_url: import.meta.env.VITE_REDIRECT_URL,
    });

    client
        .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID) // Your project ID

    const promise = functions.createExecution(
        import.meta.env.VITE_FUNCTION_ID, // functionId
        body, // body (optional)
        false, // async (optional)
        "/payment", // path (optional)
        "POST" // method (optional)
    );

    const data = promise
        .then((response) => JSON.parse(response.responseBody))
        .then((data) => {
            return data;
        });

    return data;
}

function App() {
    const [paymentData, setPaymentData] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        requestPayment(name, phone, price).then((data) => {
            setPaymentData(data);
            setPaymentUrl(
                data?.data?.data?.instrumentResponse?.redirectInfo?.url
            );
        });
    };

    useEffect(() => {
        console.log(paymentData);
    }, [paymentData]);

    return (
        <div>
            <h1>Payment Gateway</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    className="bg-transparent"
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    className="bg-transparent"
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Price"
                    className="bg-transparent"
                    onChange={(e) => setPrice(e.target.value)}
                />
                <button type="submit">Pay</button>
            </form>

            {paymentUrl && (
                <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 text-white p-2 rounded-md"
                >
                    Pay Now
                </a>
            )}
        </div>
    );
}

export default App;
