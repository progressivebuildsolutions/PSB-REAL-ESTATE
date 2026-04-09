import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { getChatResponse } from '../lib/gemini';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Hello! I am your PBS Real Estate Assistant. How can I help you find your dream property today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const history = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await getChatResponse(userMessage, history);
    setMessages(prev => [...prev, { role: 'model', text: response || 'Sorry, I encountered an error.' }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-stone-900 shadow-2xl hover:bg-stone-800 z-50"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-stone-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-stone-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">PBS Assistant</div>
                  <div className="text-[10px] text-stone-400">Online</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" viewportRef={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-stone-900 text-white rounded-tr-none' 
                        : 'bg-stone-100 text-stone-900 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-stone-100 p-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce" />
                        <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-stone-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="rounded-xl border-stone-200"
                />
                <Button type="submit" size="icon" className="rounded-xl bg-stone-900 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
