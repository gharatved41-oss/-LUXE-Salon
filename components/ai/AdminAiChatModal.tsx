'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Zap,
} from 'lucide-react'
import {
  ChatMessage,
  Appointment,
  QueueItem,
  ServiceItem,
  StaffMember,
  RefundRequest,
  AuditLogEntry,
} from '@/lib/types'
import { askAdminAi } from '@/lib/aiEngine'
import { useLanguage } from '@/lib/language'

interface AdminAiChatModalProps {
  isOpen: boolean
  onClose: () => void
  services: ServiceItem[]
  staff: StaffMember[]
  appointments: Appointment[]
  queue: QueueItem[]
  refunds: RefundRequest[]
  auditLogs: AuditLogEntry[]
}

const QUICK_PROMPTS = [
  'How busy is the salon today?',
  'Which stylist is overloaded today?',
  "Why did today's revenue decrease?",
  'Run AI smart queue optimization',
]

export default function AdminAiChatModal({
  isOpen,
  onClose,
  services,
  staff,
  appointments,
  queue,
  refunds,
  auditLogs,
}: AdminAiChatModalProps) {
  const { language } = useLanguage()
  const isEn = language === 'en'

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'ai',
      text: isEn
        ? `👋 **Hello Admin!** I am your **Executive Operational AI Copilot**.\n\nI continuously monitor salon chair occupancy, stylist workloads, live queues, revenue metrics, and floor throughput in real time.\n\nAsk me anything about today's operations!`
        : `👋 **नमस्ते Admin!** I am your **Ustaad Executive Operational AI Copilot**.\n\nI continuously monitor salon chair occupancy, stylist workloads, live queues, revenue leaks, and floor throughput in real time.\n\nAsk me anything about today's operations!`,
      timestamp: 'Just now',
    },
  ]

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
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
      const aiResponseText = askAdminAi(query, {
        services,
        staff,
        appointments,
        queue,
        refunds,
        auditLogs,
      })

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsThinking(false)
    }, 450)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-body">
      <div className="glass-modal max-w-2xl w-full h-[620px] flex flex-col overflow-hidden text-[#1C1B1A]">
        {/* Header */}
        <div className="p-4 glass-haldi flex items-center justify-between text-[#1C1B1A] rounded-t-[26px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/40 backdrop-blur-md text-[#1C1B1A] border border-white/80 flex items-center justify-center shadow-sm">
              <Bot size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold font-hindi">
                  {isEn ? 'AI Copilot (Executive Intelligence)' : 'उस्ताद AI Copilot (Executive Intelligence)'}
                </h3>
                <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/70 border border-white/80 uppercase font-mono shadow-xs">
                  Live Feed
                </span>
              </div>
              <p className="text-[11px] text-[#1C1B1A]/80 font-medium">
                Real-time diagnostics for floor chairs, stylist fatigue, and sales
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#1C1B1A] hover:bg-black/10 rounded-xl border border-white/40 transition-colors cursor-pointer"
            aria-label="Close AI modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggested Question Badges */}
        <div className="p-3 bg-white/30 backdrop-blur-md border-b border-white/60 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-xl btn-kitsch-secondary text-[#1C1B1A] whitespace-nowrap text-left flex items-center gap-1.5 shadow-sm"
            >
              <Zap size={12} className="text-[#D63927] shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-white/20 backdrop-blur-md">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-white/70 backdrop-blur-md text-[#1C1B1A] border border-white/80 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot size={16} />
                </div>
              )}

              <div
                className={`max-w-lg p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'glass-terracotta text-white shadow-sm'
                    : 'glass-card text-[#1C1B1A]'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed text-xs">
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

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#D63927] text-white border border-white/80 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-xs text-[#1C1B1A] pl-2 font-bold">
              <div className="w-7 h-7 rounded-xl bg-white/70 border border-white/80 flex items-center justify-center shadow-xs">
                <Bot size={14} />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#D63927] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#D63927] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#D63927] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-[#5C564E] ml-1 font-mono">Analyzing floor chairs and salon telemetry...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white/70 backdrop-blur-xl border-t border-white/60 rounded-b-[26px]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'How busy is the salon?', 'Which stylist is overloaded?')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 glass-input text-[#1C1B1A] text-xs font-semibold outline-none placeholder:text-[#5C564E]/60 shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 btn-kitsch-haldi flex items-center justify-center cursor-pointer"
              aria-label="Send query to AI"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
