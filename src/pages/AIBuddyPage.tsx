import VoiceAgent from '../components/VoiceAgent';

export default function AIBuddyPage() {
  const handleSessionStart = () => {
    console.log('Voice session started');
  };

  const handleSessionEnd = () => {
    console.log('Voice session ended');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container-narrow py-8">
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            AI Meditation Buddy
          </h1>
          <p className="text-gray-400 text-lg">
            Your personal voice-guided meditation assistant
          </p>
        </div> */}
        
        <div className="max-w-2xl mx-auto">
          <VoiceAgent 
            onSessionStart={handleSessionStart}
            onSessionEnd={handleSessionEnd}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
          />
        </div>
      </div>
    </div>
  );
}