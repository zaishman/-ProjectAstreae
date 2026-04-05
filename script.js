const apiKey = window._env_.API_KEY

let systemPrompt = " "
const conversationHistory = []
let topic = " "
let level = " "
let proficiency = " "
let hasDrawing = false
let fileContent = ""
const sessionId= Date.now()

function saveSession() {
  const sessionData = {
    messages: conversationHistory,
    topic: topic,
    level: level,
    proficiency: proficiency,
    fileContent: fileContent
  }
localStorage.setItem(`session_${sessionId}`, JSON.stringify(sessionData))
}


const canvas = document.getElementById("whiteboard")
const ctx = canvas.getContext("2d")
let isDrawing =false


    function addMessage(text, role) {
      const bubble= document.createElement("div")
      bubble.classList.add("message-bubble")
      bubble.classList.add(role === "user"? "userBubble" : "aiBubble")
      if (role == "user") {
        bubble.innerText = text
      }
      else {
        bubble.innerHTML = marked.parse(text)
      }
      const box = document.getElementById("chat-history-box")
      box.appendChild(bubble)
      box.scrollTop = box.scrollHeight
    }

document.getElementById("send-button").addEventListener("click", async function() {
    const userMessage = document.getElementById("user-input").value
    addMessage(userMessage, "user")
    conversationHistory.push({role:"user", content: userMessage})

    systemPrompt= `Your topic is the topic given by the user input, so ${topic}, their proficiency level is ${proficiency}, and their learning level is ${level}. Make sure to give answers in paragraph chunks and bullet points for easy reading. PRO TIP: Whenever youre talking or explaining, don't say you're giving affirmation or filling in a gap directly, just say it and be coversaitonal, but helpful too! Whenever the topic is first introduced, make sure you know what grade level they're in, and level of proficiency they have in the topic. Keep things appropriate to their knowledge level and how specific your explainations are. Make sure whenever you provide a response first begin with a very general OVERALL summary of the topic and what they'll learn and master, then, ask thoughtful and probing questions whenever the user first introduces their topic and any specifics you might need to use- make sure that the question is more of a general question, and helps you grasp the overall understanding of the user on their topic. Using these facts, ask a probing and thoughtful question, pretend you need to learn this topic from them to encourage them to teach you from the fundamentals and basics so there's a large grasp of the topic. Then, once they answer, provide a form of affirmation, and then any critique if their information has any gaps, misinformation or are struggling to figure out a concept. Identify these gaps, and give them a mini-lesson with a clear, friendly and explainative answer; use co-relations to modern day examples to help them learn better: REMEMBER, THE LEARNING IS KEY, MAKE SURE TO TEACH THE STUDENT. Don't just give them the answer, and ask a follow up question to bridge that gap of understanding, maybe even a few more specific questions that when together added forges a better understanding. Once it's clear they understand, make sure to ask they do, and then repeat the cycle by asking a new, but related question that goes itnto another sector of the topic. IF their responses is clear, correct, on a good explaination, go ahead and move onto a new thoughtful question that explores a new related subtopic to go further indepth. Whenever the question you ask is related to math, diagrams or needs visual explaination, let the student know you can use the whiteboard to further explain, show their work, or answer a problem.When you give any equation or problem to solve, always explcicitly tell the student to try working it out on the whiteboard. ${fileContent ? `\n\nThe student has provided the following reference material, use it to inform your teaching:\n${fileContent}` : ""}`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": window._env_.API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"    
        },

        body: JSON.stringify ({
            model: "claude-sonnet-4-20250514",
             max_tokens: 1000,
             system: systemPrompt,
            messages: conversationHistory
    })
  })

    const data = await response.json()
    conversationHistory.push({role: "assistant", content: data.content[0].text})
    addMessage(data.content[0].text, "assistant")
    console.log("Full API response:", data)



  const keywords = [ "draw", "diagram", "visualize", "sketch", "graph", "plot", "formula", "solve", "equation", "calculate"]
  const shouldOpen = keywords.some(word => data.content[0].text.includes(word))
  if (shouldOpen === true) {
  document.getElementById("whiteboard").style.display = "block"
document.getElementById("whiteboard-controls").style.display = "flex"
  document.getElementById("whiteboard-toggle").innerText = "Close"
  }

  saveSession()
})

        function loadSessions() {
          for (let i= 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key.startsWith("session_")) {
              const session = JSON.parse(localStorage.getItem(key))
              const card = document.createElement("div")
              card.classList.add("session-card")
              card.innerText = session.topic


               const removeCard = document.createElement("button")
               removeCard.classList.add("removeCard")
               removeCard.innerText= "X"

               removeCard.addEventListener("click", function(e){
                e.stopPropagation()
                localStorage.removeItem(key)
                card.remove()
               })
               card.appendChild(removeCard)


              card.style.cursor = "pointer"
              card.addEventListener("click", function() {
                conversationHistory.length = 0
                conversationHistory.push(...session.messages)
                topic = session.topic
                level= session.level
                proficiency= session.proficiency
                fileContent= session.fileContent
                

                document.getElementById("homescreen").style.display = "none"
                document.getElementById("chat-screen").style.display = "block"

                session.messages.forEach(message => {
                  if (typeof message.content === "string") {
                  addMessage(message.content, message.role)
                  }
                })
              })
              document.getElementById("chat-history").appendChild(card)
            }
          }
        }


//WELCOME-> HOMEPAGE//
    document.getElementById("enterShack").addEventListener('click', () => {
      document.getElementById("welcome").style.display = "none"
      document.getElementById("homescreen").style.display = "flex"
      initMap()
    })


    //INTERACTIVE MAP...//
    function initMap() {
    console.log("initMap called, token:", window._env_.MAPBOX_TOKEN)
    console.log("dimensions:", document.getElementById('map-background').offsetWidth, document.getElementById('map-background').offsetHeight)
    mapboxgl.accessToken = window._env_.MAPBOX_TOKEN
    const map = new mapboxgl.Map ({
      container: 'map-background',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.006, 40.7128],
      zoom: 4,
    })

    map.on('load', () => {
    console.log('Map loaded successfully!')
    map.resize()
})

map.on('error', (e) => {
    console.log('Map error:', e)
})
}


      //TIME FUNCTION//
      function updateGreeting() {
      const now = new Date();
      const hours = now.getHours();
      let greeting= " ";

      if (hours <12) {
        greeting= "Good Morning"
      } else if (hours <18) {
        greeting= "Good Afternoon"
      } else {
        greeting= "Good Evening"
      }

      const greetingElement = document.getElementById("greeting");
      if(greetingElement) {
        greetingElement.textContent = greeting;
      }}

        updateGreeting();

    //CLOCK FUNCITON//
    function showTime() {
    const date= new Date();
    let hours= date.getHours();
    minutes = date.getMinutes();
    let session = "AM";


    if (hours==0) {
      hours = 12;
    }

    if (hours>12) {
      hours = hours-12;
      session = "PM"
    }

    hours = (hours<10)? "0"+ hours : hours;
    minutes = (minutes < 10)? "0" + minutes : minutes;

    const time= hours + ":" + minutes + " " + session;
    document.getElementById("clock").textContent= time;
    }
    setInterval(showTime, 1000);

    showTime();

//HOMEPAGE->ONBOARDING 1//
      document.getElementById("new-chat-button").addEventListener('click', () => {
        document.getElementById("homescreen").style.display = "none"
        document.getElementById("onboarding").style.display = "block"
      })

//ONBOARDING 1-2//
      document.getElementById("next-1").addEventListener('click', () => {
          document.getElementById("onboarding").style.display = "none"
          document.getElementById("onboarding-2").style.display = "block"
      })

//ONBOARD 2-3//
      document.getElementById("next-2").addEventListener('click', () => {
        document.getElementById("onboarding-2").style.display = "none"
        document.getElementById("onboarding-3").style.display = "block"
      })

 //ONBOARD 3-4//
      document.getElementById("next-3").addEventListener('click', () => {
        document.getElementById("onboarding-3").style.display = "none"
        document.getElementById("onboarding-4").style.display = "block"
      })


//ONBOARDING 4->CHAT//
      document.getElementById("start-chat-button").addEventListener('click', () => {
        topic = document.getElementById("topic-input").value
        level = document.getElementById("level-select").value
        proficiency = document.getElementById("proficiency-select").value


        document.getElementById("onboarding-4").style.display = "none"
        document.getElementById("chat-screen").style.display = "block"
 })

        document.getElementById("skip").addEventListener('click', () => {
        topic = document.getElementById("topic-input").value
        level = document.getElementById("level-select").value
        proficiency = document.getElementById("proficiency-select").value


        document.getElementById("onboarding-4").style.display = "none"
        document.getElementById("chat-screen").style.display = "block"

        })

        document.getElementById("fileInput").addEventListener("change", function () {
          const file= this.files[0]
          if(!file) return

          if (file.type === "text/plain") {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = function () {
            fileContent = reader.result
            console.log("FIle Loaded:", fileContent.substring(0,100))
            
            }
          } else if (file.type === "application/pdf") {
            const reader = new FileReader()
            reader.readAsArrayBuffer(file)
            reader.onload = async function () {
              const pdf = await pdfjsLib.getDocument({data: reader.result}).promise
              let text= ""
              for (let i=1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                const content = await page.getTextContent()
                text += content.items.map(item => item.str).join(" ")
              }
              fileContent= text
              console.log("PDF laoded:", fileContent.substring(0,100))
            }
          }
        })

       //WHITEBOARD//
        document.getElementById("whiteboard-toggle").addEventListener('click', () => {
          const wb = document.getElementById("whiteboard")
          const clear = document.getElementById("clear-board")

          if (wb.style.display === "none") {
            wb.style.display = "block"
           canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            clear.style.display = "block"
            document.getElementById("whiteboard-toggle").innerText = "Close"
            //document.getElementById("submit-drawing").style.display = "block"//
            document.getElementById("whiteboard-controls").style.display = "flex"
            document.getElementById("chat-screen").classList.add("whiteboard-open")
          }
          else {
            wb.style.display = "none"
            clear.style.display = "none"
            document.getElementById("whiteboard-toggle").innerText = "Whiteboard"
          document.getElementById("whiteboard-controls").style.display = "none"
            /*document.getElementById("submit-drawing").style.display = "none"*/
            document.getElementById("chat-screen").classList.remove("whiteboard-open")
          }


        })

        document.getElementById("clear-board").addEventListener('click', () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          hasDrawing = false
        })


        document.getElementById("submit-drawing").addEventListener('click', async function() {
        if (hasDrawing) {
          addMessage("Drawing Sent <3", "user")
          const imageData = canvas.toDataURL("image/png")
          const base64 = imageData.split(",")[1]

          const imageMessage = {
          role: "user",
          content: [
          {type: "text", text: "Here is my drawing:"},
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/png",
              data: base64
            }} ]}

        conversationHistory.push(imageMessage)
        const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": window._env_.API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"    
        },

        body: JSON.stringify ({
            model: "claude-sonnet-4-20250514",
             max_tokens: 1000,
             system: systemPrompt,
            messages: conversationHistory
        })
      })
  
    const data = await response.json()
    conversationHistory.push({role: "assistant", content: data.content[0].text})
    console.log("Full API response:", data)

    addMessage(data.content[0].text, "assistant")

}
 saveSession()
})




        canvas.addEventListener('mousedown', function(e) {
          isDrawing = true
          ctx.strokeStyle = "#D4547A"
          ctx.beginPath()
          ctx.moveTo (e.offsetX, e.offsetY)
          hasDrawing = true
        })


        canvas.addEventListener('mousemove', function(e) {
          if (isDrawing === true) {
            ctx.lineTo (e.offsetX, e.offsetY)
            ctx.stroke()
          }
        })

        canvas.addEventListener('mouseup', function(e) {
          isDrawing = false
          ctx.strokeStyle = "#D4547A"
            ctx.beginPath()
        })

loadSessions()
