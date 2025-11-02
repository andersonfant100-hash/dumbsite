import { createClient } from '@supabase/supabase-js'

// ------------------------
// Supabase client setup
// ------------------------
const supabase = createClient(
  'https://dwpxtoojztqhhhohwxwc.supabase.co', // your project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cHh0b29qenRxaGhob2h3eHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjU1MDUsImV4cCI6MjA3NzYwMTUwNX0.XsKi3yPO0dewL3_eUTPqZAMD8BtAwGXHGrmiX81Q_KI' // your anon public key
)

let currentChannelId = null
let userId = null

// ------------------------
// Get current logged-in user
// ------------------------
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  userId = user?.id
  if (!userId) console.warn('User not logged in yet!')
}
getCurrentUser()

// ------------------------
// Load servers
// ------------------------
async function loadServers() {
  const { data: servers } = await supabase
    .from('servers')
    .select('*')
  const serverList = document.getElementById('server-list')
  serverList.innerHTML = ''
  servers.forEach(s => {
    const div = document.createElement('div')
    div.textContent = s.name[0] // first letter as icon
    div.onclick = () => loadChannels(s.id)
    serverList.appendChild(div)
  })
}
loadServers()

// ------------------------
// Load channels
// ------------------------
async function loadChannels(serverId) {
  const { data: channels } = await supabase
    .from('channels')
    .select('*')
    .eq('server_id', serverId)
  const channelList = document.getElementById('channel-list')
  channelList.innerHTML = ''
  channels.forEach(c => {
    const li = document.createElement('li')
    li.textContent = `# ${c.name}`
    li.onclick = () => loadMessages(c.id)
    channelList.appendChild(li)
  })
}

// ------------------------
// Load messages
// ------------------------
async function loadMessages(channelId) {
  currentChannelId = channelId
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })

  const messagesDiv = document.getElementById('messages')
  messagesDiv.innerHTML = data.map(m => `<p>${m.content}</p>`).join('')

  // Realtime subscription
  supabase
    .from(`messages:channel_id=eq.${channelId}`)
    .on('INSERT', payload => {
      messagesDiv.innerHTML += `<p>${payload.new.content}</p>`
    })
    .subscribe()
}

// ------------------------
// Send a message
// ------------------------
document.getElementById('send-btn').addEventListener('click', async () => {
  const input = document.getElementById('message-input')
  if (!currentChannelId) return alert('Select a channel first!')
  if (!userId) return alert('You must be logged in!')
  await supabase.from('messages').insert([
    { channel_id: currentChannelId, user_id: userId, content: input.value }
  ])
  input.value = ''
})
