// app/page.tsx or pages/index.tsx

import Link from 'next/link';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to Our AI Chatbot</h1>
            <p>Click the button below to start chatting!</p>
            <Link href="/chat">
                <button>Go to Chat</button>
            </Link>
        </div>
    );
};

export default HomePage;
