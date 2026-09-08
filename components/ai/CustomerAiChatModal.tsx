'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Scissors,
  ChevronRight,
} from 'lucide-react'
import {
  ChatMessage,
  QueueItem,
  ServiceItem,
  StaffMember,
} from '@/lib/types'
import { askCustomerAi } from '@/lib/aiEngine'

interface CustomerAiChatModalProps {
  isOpen: boolean
  onClose: () => void
  services: ServiceItem[]
  staff: StaffMember[]
  queue: QueueItem[]
  customerName?: string
  onTriggerBooking?: (serviceId?: string, staffId?: string, time?: string) => void
  onNavigateTab?: (tab: string) => void
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'cust-msg-1',
    sender: 'ai',
    text: `👋 **नमस्ते!** I am your **Ustaad AI Concierge**.\n\nI can help you check open booking slots for today, estimate live queue wait times, or recommend personalized treatments.\n\nHow can I help you today?`,
    timestamp: 'Just now',
    quickActions: [
      { label: '✂️ Can I book a haircut today?', action: 'ask-haircut' },
      { label: '⏳ What is the live wait time?', action: 'ask-wait' },
      { label: '👑 Luxury Spa & Facials', action: 'ask-spa' },
    ],
  },
]

export default function CustomerAiChatModal({
  isOpen,
  onClose,
  services,
  staff,
  queue,
  customerName,
  onTriggerBooking,
  onNavigateTab,
}: CustomerAiChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  if (!isOpen) return null

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText
    if (!query.trim()) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsThinking(true)

    setTimeout(() => {
      const response = askCustomerAi(query, {
        services,
        staff,
        queue,
        customerName,
      })

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: response.quickActions,
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsThinking(false)
    }, 400)
  }

  const handleActionClick = (action: string, payload?: unknown) => {
    if (action === 'ask-haircut') {
      handleSendMessage('Can I book the haircut today?')
    } else if (action === 'ask-wait') {
      handleSendMessage('What is the current queue wait time?')
    } else if (action === 'ask-spa') {
      handleSendMessage('What spa and facial treatments do you recommend?')
    } else if (action === 'book-shortcut') {
      onClose()
      if (onNavigateTab) onNavigateTab('book')
    } else if (action === 'book-preferred') {
      onClose()
      if (onNavigateTab) onNavigateTab('book')
    } else if (action === 'view-services') {
      onClose()
      if (onNavigateTab) onNavigateTab('services')
    } else if (action === 'view-queue' || action === 'self-checkin') {
      onClose()
      if (onNavigateTab) onNavigateTab('queue')
    } else if (action === 'view-passes') {
      onClose()
      if (onNavigateTab) onNavigateTab('passes')
    }
  }

  return (
    <div className="fixed inset-0 bg-[#1C1B1A]/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-body">
      <div className="glass-modal max-w-lg w-full h-[580px] flex flex-col overflow-hidden text-[#1C1B1A]">
        {/* Header */}
        <div className="p-4 bg-[#D63927]/90 backdrop-blur-md text-white border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFFDF9] text-[#D63927] border border-white/40 flex items-center justify-center shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-extrabold font-hindi">डीलक्स AI Concierge</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5B82E] animate-pulse" />
              </div>
              <p className="text-[10px] text-white/90">
                Instant answers on appointments, wait times & stylists
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close Concierge"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-transparent">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-[#F5B82E] text-[#1C1B1A] border border-[#1C1B1A]/20 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot size={16} />
                </div>
              )}

              <div className="max-w-md space-y-2">
                <div
                  className={`p-3.5 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#1E75B8] text-white shadow-sm'
                      : 'bg-[#FFFDF9]/90 backdrop-blur-md border border-[#1C1B1A]/12 text-[#1C1B1A] shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed text-xs font-semibold">
                    {m.text}
                  </div>
                  <span
                    className={`text-[9px] block mt-1.5 font-mono ${
                      m.sender === 'user' ? 'text-white/80 text-right' : 'text-[#5C564E]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {/* Quick Action Suggestions */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.quickActions.map((act) => (
                      <button
                        key={act.label}
                        onClick={() => handleActionClick(act.action, act.payload)}
                        className="px-3 py-1 bg-[#FFFDF9]/90 hover:bg-[#F5B82E] backdrop-blur-sm border border-[#1C1B1A]/15 rounded-lg text-[#1C1B1A] font-bold text-[11px] shadow-2xs hover:shadow-xs flex items-center gap-1 transition-all"
                      >
                        <span>{act.label}</span>
                        <ChevronRight size={11} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#1E75B8] text-white border border-white/30 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2.5 items-center text-xs text-[#1C1B1A] pl-1 font-bold">
              <div className="w-6 h-6 rounded-lg bg-[#F5B82E] border border-[#1C1B1A]/20 flex items-center justify-center shadow-2xs">
                <Bot size={13} />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#D63927] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#D63927] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#D63927] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-[#5C564E] ml-1 font-mono">Checking open slots at Ustaad Salon...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#F6EFE2]/70 backdrop-blur-md border-t border-[#1C1B1A]/15">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask (e.g. 'Can I book a haircut today?', 'What is the wait time?')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 glass-input text-xs font-semibold outline-none focus:ring-2 focus:ring-[#D63927] transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 btn-kitsch-primary flex items-center justify-center"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
