// ==UserScript==
// @name       CoSoDisquoteByPaercebal
// @namespace  http://paercebal/GreaseMonkeyScripts
// @version    1.0
// @match      https://counter.social/*
// @grant      none
// ==/UserScript==

let paercebal_isDebugging = false;

let paercebal_mainLoopIntervalId = null;
let paercebal_textareaDebug = null;
let paercebal_textareaInput = null;
let paercebal_buttonDisaquote = null;

function paercebal_onload()
{
  try
  {
    paercebal_addDebugTextarea();
    
    if(paercebal_mainLoopIntervalId == null)
    {
      paercebal_mainLoopIntervalId = window.setInterval(paercebal_mainLoop, 1000);
    }
  }
  catch(e)
  {
    window.alert("Oops! Something wrong happened: " + e.toString())
  }
}

window.addEventListener("load", paercebal_onload, true);

function paercebal_addDebugTextarea()
{
  // If you don't have a body, then you have a problem
  let bodies = document.getElementsByTagName("body");
  
  if(bodies.length != 1)
  {
    throw new Error("You have [" + bodies.length + "] bodies. WTF?");
  }
  
  let absoluteDiv = document.createElement("div");
  bodies[0].appendChild(absoluteDiv);
  let absoluteDivStyle = [];
  if(! paercebal_isDebugging)
  {
  	absoluteDivStyle.push("display : none;");
  }
  absoluteDivStyle.push("width : 300px;");
  absoluteDivStyle.push("height : 175px;");
  absoluteDivStyle.push("background-color : #888888;");
  absoluteDivStyle.push("border : 2px #FF0000 solid;");
  absoluteDivStyle.push("padding : 1px;");
  absoluteDivStyle.push("position : absolute;");
  absoluteDivStyle.push("top : 10px;");
  absoluteDivStyle.push("left : 10px;");
  absoluteDiv.setAttribute("style", absoluteDivStyle.join(""));
  
  let textarea = document.createElement("textarea");
  absoluteDiv.appendChild(textarea);
  let textareaStyle = [];
  textareaStyle.push("width : 294px;");
  textareaStyle.push("height : 168px;");
  textarea.setAttribute("style", textareaStyle.join(""));
  textarea.value = "Hello World";
  
  paercebal_textareaDebug = textarea;
}

function paercebal_log(text)
{
  if(paercebal_isDebugging)
  {
    if(paercebal_textareaDebug)
    {
      paercebal_textareaDebug.value += "\n" + text;
      paercebal_textareaDebug.scrollTop = 99999999999999;
    }
  }
}

function paercebal_tryToFindTextareaInput()
{
  if(paercebal_textareaInput == null)
  {
    paercebal_log("Trying to find textarea...");
    
    var t = document.getElementsByClassName("autosuggest-textarea__textarea");

    if(t.length == 1)
    {
      paercebal_textareaInput = t[0];
      paercebal_log("Found textarea!");
    }
  }
}

function paercebal_tryToAddButtonDisaquote()
{
  if(paercebal_buttonDisaquote == null)
  {
    paercebal_log("Trying to add button...");
    
    var divWrappers = document.getElementsByClassName("compose-form__publish-button-wrapper");

    //paercebal_log("   - found [" + divWrappers.length + "] divWrappers...");
    
    if(divWrappers.length == 1)
    {
      divWrapper = divWrappers[0];
      
      // Remove block-style from Toot button
      var buttonToots = divWrapper.getElementsByTagName("button");
      
      if(buttonToots.length == 1)
      {
        buttonToot = buttonToots[0];
        
        if(buttonToot.getAttribute("id") != "paercebal_disaquote_id")
        {
          buttonToot.setAttribute("class", "button");
          //paercebal_log("   - changed button attribute...");
        }

        // add Disaquote button
        let disaquoteButton = document.createElement("button");
        divWrapper.insertBefore(disaquoteButton, buttonToot);
        disaquoteButton.setAttribute("class", "button");
        let disaquoteButtonStyle = [];
        disaquoteButtonStyle.push("padding: 0px 16px;");
        disaquoteButtonStyle.push("height: 36px;");
        disaquoteButtonStyle.push("line-height: 36px;");
        disaquoteButtonStyle.push("background-color : #008800;");
        disaquoteButtonStyle.push("margin-right : 1em;");
        disaquoteButton.setAttribute("style", disaquoteButtonStyle.join(""));
        disaquoteButton.setAttribute("id", "paercebal_disaquote_id");
        disaquoteButton.textContent = "Disaquote!";
        disaquoteButton.addEventListener("click", paercebal_escapeTextareaInputQuotes, true);

        paercebal_buttonDisaquote = disaquoteButton;
        paercebal_log("Added button!");
      }
    }
  }
}

let paercebal_mainLoopCounter = 0;

function paercebal_mainLoop()
{
  paercebal_log("Looping [" + (paercebal_mainLoopCounter++) + "]...");
  
  paercebal_tryToFindTextareaInput();
  paercebal_tryToAddButtonDisaquote();
  
  if((paercebal_textareaInput != null) && (paercebal_buttonDisaquote != null))
  {
    paercebal_log("Found textarea and added button!");
    window.clearInterval(paercebal_mainLoopIntervalId);
    paercebal_mainLoopIntervalId = null;
    paercebal_log("End of initialization.");
  }
}

function paercebal_escapeTextareaInputQuotes()
{
  paercebal_log("Trying to escape...");
  
  if(paercebal_textareaInput != null)
  {
    var text = paercebal_textareaInput.value;
    paercebal_log("Text is [" + text + "]");
    text = text.replace("\"", "”");
    text = text.replace("\'", "’");
    paercebal_log("Escaped text is [" + text + "]");
    paercebal_textareaInput.value = text;
  }
}
