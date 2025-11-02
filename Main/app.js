import { createClient } from '@supabase/supabase-js'

// ------------------------
// Supabase setup
// ------------------------
const supabase = createClient(
  'https://dwpxtoojztqhhhohwxwc.supabase.co', // Your project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cHh0b29qenRxaGhob2h3eHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjU1MDUsImV4cCI6MjA3NzYwMTUwNX0.XsKi3yPO0dewL3_eUTPqZAMD8BtAwGXHGrmiX81Q_KI' // Your anon public key
)

let currentChannelId = null
let userId = null
let userData = {}

// ------------------------
// Get current user
// ------------------------
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  userId = user?.id
  if (!userId) console.warn('User not logged in yet!')
  else loadUserProfile()
}

// Load user profile (avatar + username)
async function loadUserProfile() {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (!profile) return
  userData = profile
  document.getElementById('user-name').textContent = profile.username
  document.getElementById('user-avatar').src = profile.avatar_url || 'https://via.placeholder.com/40'
}

// ------------------------
// Load servers
// ------------------------
async function loadServers() {
  const { data: servers } = await supabase.from('servers').select('*')
  const serverList = document.getElementById('server-list')
  serverList.innerHTML = ''
  servers.forEach(s => {
    const div = document.createElement('div')
    div.textContent = s.name[0].toUpperCase()
    div.onclick = () => loadChannels(s.id)
    serverList.appendChild(div)
  })
}

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
  const { data: messages } = await supabase
    .from('messages')
    .select(`*, profiles(username, avatar_url)`)
    .eq('channel_id', channelId)
    .order('created_at', { ascending: true })

  const messagesDiv = document.getElementById('messages')
  messagesDiv.innerHTML = messages.map(m => `
    <div class="message">
      <img class="avatar" src="${m.profiles?.avatar_url || 'https://via.placeholder.com/30'}" />
      <span class="username">${m.profiles?.username || 'Unknown'}</span>
      <span class="content">${m.content}</span>
    </div>
  `).join('')

  // Realtime subscription
  supabase
    .from(`messages:channel_id=eq.${channelId}`)
    .on('INSERT', payload => {
      const m = payload.new
      messagesDiv.innerHTML += `
        <div class="message">
          <img class="avatar" src="${userData.avatar_url || 'https://via.placeholder.com/30'}" />
          <span class="username">${userData.username}</span>
          <span class="content">${m.content}</span>
        </div>
      `
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
  if (!input.value) return
  await supabase.from('messages').insert([
    { channel_id: currentChannelId, user_id: userId, content: input.value }
  ])
  input.value = ''
})

// ------------------------
// Initialize
// ------------------------
getCurrentUser()
loadServers()
