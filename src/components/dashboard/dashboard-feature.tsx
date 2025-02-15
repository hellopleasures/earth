'use client'

import { useState } from 'react'
import { EarthStatus } from './earth-status'
import { AppHero } from '../ui/ui-layout'

// Add these new types and functions after imports
type SchumannData = {
  amplitude: number;
  frequency: number;
  timestamp: string;
}

const interpretSchumannResonance = (data: SchumannData) => {
  // Basic interpretation of Schumann resonance values
  const baselineFreq = 7.83; // Base Schumann frequency
  const deviation = data.frequency - baselineFreq;
  
  if (Math.abs(deviation) < 0.1) {
    return "Earth's electromagnetic field is currently stable and harmonious.";
  } else if (deviation > 0) {
    return `Earth's electromagnetic activity is heightened (${data.frequency.toFixed(2)} Hz), which often correlates with increased global activity or solar influences.`;
  } else {
    return `Earth's electromagnetic frequency is lower than usual (${data.frequency.toFixed(2)} Hz), suggesting a period of relative electromagnetic calm.`;
  }
}

const fetchSchumannData = async (): Promise<SchumannData | null> => {
  try {
    // Note: This is a placeholder URL - you'll need to replace with an actual Schumann resonance API
    const response = await fetch('https://api.example.com/schumann-resonance');
    if (!response.ok) throw new Error('Failed to fetch Schumann data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching Schumann data:', error);
    return null;
  }
}

type Tab = 'chat' | 'status' | 'data'

export default function DashboardFeature() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<{ role: 'user' | 'earth', content: string }[]>([
    { role: 'earth', content: 'Greetings, I am Earth - your planetary guide. I contain the knowledge of all natural systems, ecosystems, geology, climate, and life that exists within me. How may I assist you today?' }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setConversation(prev => [...prev, { role: 'user', content: message }])

    // Check if the message is asking about Earth's current state or resonance
    const isAskingAboutResonance = message.toLowerCase().includes('resonance') || 
      message.toLowerCase().includes('frequency') ||
      message.toLowerCase().includes('how are you feeling');

    let earthResponse = '';
    
    if (isAskingAboutResonance) {
      const schumannData = await fetchSchumannData();
      if (schumannData) {
        earthResponse = interpretSchumannResonance(schumannData);
      } else {
        earthResponse = "I'm unable to measure my electromagnetic resonance at the moment, but I can still share my knowledge about other topics.";
      }
    } else {
      earthResponse = await simulateEarthResponse(message);
    }

    setConversation(prev => [...prev, { role: 'earth', content: earthResponse }])
    setMessage('')
  }

  // Temporary simulation function (replace with actual AI integration)
  const simulateEarthResponse = async (userMessage: string) => {
    // Add delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responses = [
      "As your living planet, I can tell you that this area of inquiry relates to my complex systems of...",
      "My ecosystems have evolved over billions of years to create...",
      "From my geological records, I can share that...",
      "The intricate web of life I sustain shows that...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="flex flex-col h-full">
      <div className="tabs tabs-boxed justify-center mb-4">
        <a 
          className={`tab ${activeTab === 'chat' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Earth Chat
        </a>
        <a 
          className={`tab ${activeTab === 'status' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          Planetary Status
        </a>
        <a 
          className={`tab ${activeTab === 'data' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Earth Data
        </a>
      </div>

      <div className="flex-1">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 space-y-4 overflow-auto">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}
                >
                  <div className={`chat-bubble ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-content' 
                      : 'bg-neutral text-neutral-content'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-base-300">
              <div className="max-w-4xl mx-auto flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask Earth anything..."
                  className="input input-bordered flex-1"
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        )}
        {activeTab === 'status' && <EarthStatus />}
        {activeTab === 'data' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Earth Data Analysis</h2>
            {/* Add Earth data visualizations here */}
          </div>
        )}
      </div>
    </div>
  )
}
