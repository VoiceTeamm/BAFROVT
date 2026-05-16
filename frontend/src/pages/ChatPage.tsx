import { Card } from '../components/ui'
import { ChatWindow } from '../components/chat/ChatWindow'
import { ChatInput } from '../components/chat/ChatInput'
import { VoiceButton } from '../components/chat/VoiceButton'
import { useChat } from '../hooks/useChat'

export function ChatPage() {
  const { messages, isTyping, sendMessage } = useChat()

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-text-light">
          AI Financial Assistant
        </h1>
        <VoiceButton onTranscript={sendMessage} />
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        <ChatWindow messages={messages} isTyping={isTyping} />
        <ChatInput onSend={sendMessage} disabled={isTyping} />
      </Card>
    </div>
  )
}
