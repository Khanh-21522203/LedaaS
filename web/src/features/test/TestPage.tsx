export function TestPage() {
    return (
        <div className="p-8 bg-red-100">
            <h1 className="text-4xl font-bold text-blue-600">
                Test Page
            </h1>
            <p className="mt-4 text-lg">
                If you can see this, React is working!
            </p>
            <button 
                onClick={() => alert("Button clicked!")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Click Me
            </button>
        </div>
    );
}
