import UrlInput from "../components/UrlInput";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-3xl font-bold mb-6">🎯 Social Media Downloader</h1>
      <UrlInput />
    </div>
  );
};

export default Home;
