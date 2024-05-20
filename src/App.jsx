import { Client, Functions } from "appwrite";
import { useEffect, useState } from "react";

const client = new Client();
const functions = new Functions(client);

function requestPayment(name, phone, price, setLoading) {
    setLoading(true);
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
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Your project ID

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

    setLoading(false);

    return data;
}

function App() {
    const [paymentData, setPaymentData] = useState(null);
    const [paymentUrl, setPaymentUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        requestPayment(name, phone, price, setLoading).then((data) => {
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
            {!loading && !paymentData && (
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col max-w-sm gap-2 m-auto"
                >
                    <input
                        type="text"
                        placeholder="Name"
                        className="bg-white text-black p-2 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        className="bg-white text-black p-2 rounded-md"
                        value={phone}
                        onChange={(e) => {
                            if (e.target.value.match(/^\d{0,10}$/)) {
                                setPhone(e.target.value);
                            }
                        }}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Price"
                        className="bg-white text-black p-2 rounded-md"
                        value={price}
                        onChange={(e) => {
                            if (e.target.value.match(/^\d{0,10}$/)) {
                                setPrice(e.target.value);
                            }
                        }}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        Pay
                    </button>
                </form>
            )}

            {loading && <p>Loading...</p>}

            {paymentUrl && (
                <>
                <h3 className="text-center">Click the button below to pay</h3>
                <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 text-white p-2 rounded-md m-auto block w-max"
                >
                    Go to Payment Gateway
                </a>
                </>
            )}
        </div>
    );
}

export default App;
