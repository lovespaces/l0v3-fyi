const keyboard_log = document.getElementsByClassName('keyboard_log')[0];
const reset_button = document.getElementsByClassName('retry')[0];
const html_result = document.getElementsByClassName('result')[0];
const html_prompt = document.getElementsByClassName('prompt')[0];
const url = './data.json';
const options = {
      method: 'GET',
};
let random_prompt = [];
let mastered_type = 0;
let list_index = 0;
let success_type = 0;
let missed_type = 0;
let didnt_type = 0;
let backspace_type = 0;
let space_type = 0;
let all_type = 0;
let all_length = 0;
let typed_length = 0;
let typed_first = 0;
let typing_time = 0;
let array_split = 0;
let is_space = 0;
let stopwatch_typing;
var current_active = "green";

document.addEventListener('DOMContentLoaded',
    () => {
        getPrompt(url, options);
    }
  );

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function fetchGet(url, options) {
    return fetch(url, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('エラーです');
      }).catch(e => console.log(e.message));
  }

async function getPrompt(url, options) {
    const response = await fetchGet(url, options);
    const prompt = response.words;
    resetPrompt(prompt);
}

async function getAvailable(url, options, key, code){
    const response = await fetchGet(url, options);
    const available = response.available;
    checkKeys(key, code, available);
}

function checkKeys(key, code, available){
    if(available.includes(code)){
        if(key == "Backspace"){
            if(keyboard_log.lastElementChild){
                if((typed_length - 1 ) != -1){
                    const lastChild = keyboard_log.lastElementChild;
                    if(lastChild.className == "green"){
                        success_type--;
                    }else{
                        missed_type--;
                    }
                    lastChild.textContent = lastChild.textContent.slice(0, -1);
                    if(lastChild.textContent == ""){
                        lastChild.remove();
                    }
                    if(lastChild.innerHTML.slice(-13) == "&nbsp;</span>"){
                        is_space = 1;
                    }
                    all_type--;
                    typed_length--;
                    backspace_type++;
                }
            }
        }else if(code == "Space"){
            let additional = "";
            list_index++;
            if(typed_length != 0){
                space_type++;
                if(typed_length < (array_split.length)){
                    space_type--;
                    for(let i = typed_length; i < (array_split.length); i++){
                        additional += array_split[i];
                        didnt_type++;
                    };
                    additional = '<span class="yellow">' + additional + "</span>";
                    keyboard_log.insertAdjacentHTML(
                        'beforeend',
                        additional
                    );
                }
                if(random_prompt[list_index]){
                    array_split = random_prompt[list_index].split('');
                    for(const item of array_split){
                        all_length++;
                    }
                    typed_length = 0;
                    is_space = 1;
                    keyboard_log.insertAdjacentHTML(
                        'beforeend',
                        "<span>&nbsp;</span>"
                    );
                }else{
                    clearInterval(stopwatch_typing);
                    finishTheLine();
                }
            }
        }else{
            all_type++;
            typed_length++;
            if(key == array_split[typed_length - 1]){
                current_active = "green";
                success_type++;
            }else{
                current_active = "red";
                missed_type++;
            }
            if(keyboard_log.lastElementChild){
                if(keyboard_log.lastElementChild.className == current_active){
                    if(is_space == 1){
                        keyboard_log.insertAdjacentHTML(
                            'beforeend',
                            '<span class="' + current_active + '">' + key + '</span>'
                        );
                    }else{
                        keyboard_log.lastElementChild.insertAdjacentHTML(
                            'beforeend',
                            key
                        );
                    }
                }else{
                    keyboard_log.insertAdjacentHTML(
                        'beforeend',
                        '<span class="' + current_active + '">' + key + '</span>'
                    );
                }
            }else{
                if(typed_first == 0){
                    typed_first = 1;
                    stopwatch_typing = setInterval(
                        () => {
                            typing_time++;
                        }, 10
                    );
                }
                keyboard_log.insertAdjacentHTML(
                    'beforeend',
                    '<span class="' + current_active + '">' + key + '</span>'
                );
            }
            is_space = 0;
            if(list_index == random_prompt.length - 1){
                if(typed_length == array_split.length){
                    clearInterval(stopwatch_typing);
                    finishTheLine();
                }
            }
        }
    }
}

function finishTheLine(){
    current_active = "done";
    const accurate_percentage = success_type / all_length;
    const ms_seconds = typing_time / 100
    let wpm = Math.floor(((success_type + space_type) * (60 / ms_seconds) / 5) * 100) / 100;
    html_result.insertAdjacentHTML(
        'afterbegin',
        '<p id="accurate">' + Math.floor(accurate_percentage * 100) + '%, ' + wpm + 'wpm</p>\n'
    );
    html_result.insertAdjacentHTML(
        'beforeend',
        '<p id="others"><span id="gray">' + ms_seconds + ' seconds</span><br><span id="backspace_total" id="gray">\n: ' + backspace_type + '</span><br><br><span id="green">正 ' + success_type + '\n</span>\n<span id="gray"> / ' + all_type + ' / ' + all_length + '\n</span>\n<br>\n<span id="red">誤 ' + missed_type + '\n</span>\n<span id="gray"> / ' + all_type + ' / ' + all_length + '\n</span>\n<br>\n<span id="yellow">抜 ' + didnt_type + '\n</span>\n<span id="gray"> / ' + all_type + ' / ' + all_length + '\n</span>\n<br><br><span id="gray">BS ... Backspace<br>入力 / 総入力数 / お題文字数</span></p>'
    );
}

function resetAll(){
    random_prompt = [];
    mastered_type = 0;
    list_index = 0;
    success_type = 0;
    missed_type = 0;
    didnt_type = 0;
    backspace_type = 0;
    space_type = 0;
    all_type = 0;
    all_length = 0;
    typed_first = 0;
    typing_time = 0;
    typed_length = 0;
    array_split = 0;
    is_space = 0;
    current_active = "green";
    if(stopwatch_typing){
        clearInterval(stopwatch_typing);
    }
}

function resetPrompt(prompt){
    resetAll();
    reset_button.innerHTML = "";
    reset_button.insertAdjacentHTML(
        'afterbegin',
        '<button onclick="getPrompt(url, options)">\nreset\n</button>'
    )
    html_prompt.textContent = "";
    keyboard_log.textContent = "";
    if(document.getElementById('accurate')){
        html_result.innerHTML = "";
    }
    const temp_prompt = prompt;
    for(let i = 0; i < 10; i++){
        random_prompt.push(temp_prompt[Math.floor(Math.random() * temp_prompt.length)]);
        html_prompt.textContent = html_prompt.textContent + " " + random_prompt[i];
    }
    array_split = random_prompt[0].split('');
    for(const item of array_split){
        all_length++;
    }
}

document.body.addEventListener('keydown',
    event => {
        if(current_active != "done"){
            getAvailable(url, options, event.key, event.code);
        }
    });