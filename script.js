let allBlocks = document.querySelectorAll('.game-block')
let blocks = Array.from(allBlocks)
let orderRange = [...Array(blocks.length).keys()]
let startBtn = document.querySelector('.start span')
let gameSound = document.getElementById('game')
let tries = document.querySelector('.tries span')
let nameSpan = document.querySelector('.name span')
let i, score
let scoresBox = document.querySelector('.scores')
let close = document.querySelector('.close')

//Show score box
document.querySelector('.showRes').addEventListener('click', () => {
  scoresBox.style.display = 'flex'
})

shuffle(orderRange)
//Start button click action
startBtn.onclick = () => {
  let name = prompt('Enter your name')
  if (name == null || name == '') {
    nameSpan.innerHTML = 'unknown'
  } else {
    nameSpan.innerHTML = name
  }
  document.querySelector('.start').remove()
  gameSound.play()
  gameSound.loop = 'true'
  startNow()
}
let res = document.querySelector('.result span')
let time = document.querySelector('.time')
console.log(score)
//Count dowm timer
function startNow() {
  let timeleft = 100
  let counter = 0
  let timer = setInterval(timeIt, 1000)
  function converts(s) {
    let mins = Math.floor(s / 60)
    let min = mins < 10 ? '0' + mins : mins
    let secs = s % 60
    let sec = secs < 10 ? '0' + secs : secs
    if (min == 0 && sec <= 10) {
      time.style.color = '#F00'
    }
    if (min == 0 && sec == 0) {
      clearInterval(timer)
      localStorage.setItem(`player-${nameSpan.innerHTML}`, score)
      document.querySelector('.memory-game-blocks').classList.add('no-click')
      document.querySelector('.result').style.display = 'flex'
      gameSound.pause()
    }
    i = 0
    blocks.forEach((block) => {
      if (block.classList.contains('match')) {
        i++
      }
      if (i == blocks.length) {
        clearInterval(timer)
        document.querySelector('.memory-game-blocks').classList.add('no-click')
        gameSound.pause()
        document.querySelector('.result').style.display = 'flex'
        if (parseInt(tries.innerHTML) < 7) {
          localStorage.setItem(`Player-${nameSpan.innerHTML}`, Math.floor(score))
          res.innerText = 'Good Job👏😍'
        } else {
          res.innerText = 'Try again, you can do  it 😊'
          localStorage.setItem(`player-${nameSpan.innerHTML}`, Math.floor(score))
        }
      } else {
        res.innerText = 'Try again, you can do  it 😊'
        localStorage.setItem(`player-${nameSpan.innerHTML}`, Math.floor(score))
      }
    })
    score = ((i + 1) / parseInt(tries.innerHTML)) * 100
    return min + ':' + sec
  }
  function timeIt() {
    counter++
    time.innerHTML = converts(timeleft - counter)
  }
}

//Replay button click actions
document.querySelector('.btn').addEventListener('click', () => {
  document.querySelector('.result').style.display = 'none'
  shuffle(orderRange)
  document.querySelector('.memory-game-blocks').classList.remove('no-click')
  gameSound.play()
  gameSound.loop = 'true'
  time.style.color = '#000'
  tries.innerHTML = 0
  blocks.forEach((block) => {
    block.classList.remove('match')
    block.classList.remove('flip')
  })
  startNow()
})
allBlocks.forEach((block, i) => {
  block.style.order = orderRange[i]
  block.onclick = () => {
    flipBlock(block)
  }
})
let blocksArr = Array.from(allBlocks)
function flipBlock(selectedBlock) {
  selectedBlock.classList.add('flip')
  let allFlipped = blocksArr.filter((flipped) =>
    flipped.classList.contains('flip'),
  )
  if (allFlipped.length == 2) {
    stopClicking()
    checkMatchedBlocks(allFlipped[0], allFlipped[1])
  }
}
//function to prevent clicking on game blocks
function stopClicking() {
  document.querySelector('.memory-game-blocks').classList.add('no-click')
  setTimeout(() => {
    document.querySelector('.memory-game-blocks').classList.remove('no-click')
  }, 1000)
}
//to check if the blocks clicked are matched or not
function checkMatchedBlocks(first, second) {
  if (first.dataset.social == second.dataset.social) {
    first.classList.remove('flip')
    second.classList.remove('flip')

    first.classList.add('match')
    second.classList.add('match')
    document.getElementById('success').play()
  } else {
    tries.innerHTML =
      parseInt(document.querySelector('.tries span').innerHTML) + 1
    setTimeout(() => {
      first.classList.remove('flip')
      second.classList.remove('flip')
    }, 1000)
    document.getElementById('fail').play()
  }
}
//to change orders of game blocks
function shuffle(arr) {
  let current = arr.length - 1,
    temp,
    random
  while (current > 0) {
    random = Math.floor(Math.random() * current)
    current--
    temp = arr[current]
    arr[current] = arr[random]
    arr[random] = temp
  }
  return arr
}
//TODO:  to show all scores of players stored in local storage
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i)
  let val = localStorage.getItem(key)
  let div = document.createElement('div')
  div.className = 'score'
  div.appendChild(document.createTextNode(`${key} : ${val}`))
  document.querySelector('.scores-box').appendChild(div)
}
close.onclick = () => {
  scoresBox.style.display = 'none'
}
