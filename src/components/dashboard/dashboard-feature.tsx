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
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<{ 
    role: 'user' | 'earth';
    content: string;
    timestamp: string;  // Add timestamp to the conversation type
  }[]>([
    { 
      role: 'earth', 
      content: 'Greetings, I am Earth - your planetary guide. I contain the knowledge of all natural systems, ecosystems, geology, climate, and life that exists within me. How may I assist you today?',
      timestamp: new Date().toISOString()
    }
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add timestamp to user message
    setConversation(prev => [...prev.slice(-50), { 
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString()
    }])

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

    // Add timestamp to earth response
    setConversation(prev => [...prev.slice(-50), { 
      role: 'earth', 
      content: earthResponse,
      timestamp: new Date().toISOString()
    }])
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
    <div className="container mx-auto p-4">
      <EarthStatus 
        conversation={conversation}
        message={message}
        setMessage={setMessage}
        handleSubmit={handleSubmit}
        setConversation={setConversation}
      />
    </div>
  )
}
