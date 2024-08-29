# Akatsuki 
This is the source code for the infrastructure built using AWS CDK, which supports the 9th.tokyo and Seven-Swords projects.
The name is Akatsuki a.k.a MoonLight.

## APIs

Including the following functions. Each lambda function is implemented in a verbose manner, but their integration remains loosely coupled.

### SetsuGetsuKa (雪月花)
This function is the wrapper of Gemini-1.5-Flash.

### TsukiKage (月影)
This function is the wrapper of GPT-4.

### TsukiYo (月夜)
This function is the wrapper of	Claude-Opus.

### Gekka (月華)
This function is the wrapper of Threads.

### AkiTukiYo (秋月夜)
This function is the wrapper of Bluesky.

### MuGenGetsu (夢幻月)
This function is the wrapper of Instagram.

## The central controllers

These AIs has identity

### Luna (ルナ)
Selene's identity as a Step Function.

### Artemis (アルテミス)
Artemis's identity as a Step Functions.

### Diana (ディアナ)
Diana's identity as a Step Functions.
