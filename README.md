# Prompt Tester

## :wave: 1. Introduction
This is the eventual repo for **HeffronAI's** take home assignment.

:warning: Few things to note
> 1. Frontend  
> Even though NextJS uses server compoennts as default, most of the components are still client components to provide better interactivity. e.g. animations
> 2. Backend  
> fastapi supports async operations, but definitions are defined as non-async since I am not too aware of the pitfalls of using async, especially when there are database transaction involved.
> 3. Users  
> System and paid users are the same, since the functionality of both users and the scope of their privildges are the same according to the specs, hence implementations are not present to differenciate them.

## :notebook: 2. Progress Overview

### Task 1: Sidebar
* :white_check_mark: **1.1.** As a user, I want to easily navigate between different CRM modules from the sidebar, So that I can quickly access various tools without unnecessary clicks.

* :white_check_mark: **1.2.** As a user, I want the sidebar to visually highlight the active module, so that I can easily see which part of the CRM I am currently viewing.

* :white_check_mark: **1.3.** As a CRM user, I want the ability to expand or collapse the sidebar, so that I can have more screen space for module contents when needed.

### Task 2: Main Module
* :white_check_mark: **2.1.** As a user, I want to enter a system prompt into a text box, so that I can test how the LLM responds to specific prompts.

* :white_check_mark: **2.2.** As a user, I want to converse with the GPT using the given system prompt in a chat box interface, So that I can evaluate the model’s responses in a conversational context.

### Task 3: Update model parameters
* :white_check_mark: **3.1.** As a developer, I want to adjust model parameters such as temperature and max tokens, So that I can see how changes in these parameters affect the responses of the GPT.

### Task 4: Usability
* :white_check_mark: **4.1.** As the system admin, I want the prompt input, chat interface, and model parameter settings to be integrated seamlessly, So that changes in one area can be reflected immediately in the others without needing to reload or navigate away.

> :warning: **4.1.2.** Partially finished

### Task 5: Error Handling
* :warning:(Partial) **5.1.** As a user, I want the system to handle errors gracefully, So that I can understand what went wrong and how to fix it without causing interruption to my testing process.

> Error handling in task 5 is implemented in the simplest ways possible, only few errors are handled specifically

### Bonus: Bonus Feature
* :white_check_mark: **B1.** As a user, I want to log in using my Google account, So that I can securely access the application without creating a new username and password.

> :warning: B4, B5 Partially finished

* :white_check_mark: **B2.** As a user, I want to be able to load previous chats from past testing sessions, So that I can review past interactions and compare the effects of different prompts and parameter settings on the model’s responses.

* :x: **B3.** As a DevOps engineer, I want to package the application in a container, So that it can be deployed consistently across any environment.

## :thinking: 3. Assumptions
1. Integration with AI models are only up to the selection ***Groq*** provides.
2. Dashboard and Campaign are not required to implement.
3. Editing previous messages is forbidden to all users.
4. There are more Desktop / Laptop users than mobile users.
5. Model parameters are saved only when user interacted with the chatbox (i.e. sent a message)

## :thumbsup: 4. Getting Started
Run the followin commands to get started:
```sh
# frontend
cd frontend/
npm install
npm run dev

# backend
pip install -r requirements.txt
fastapi dev main.py
```

> :warning: Both the frontend/ and the backend/ directories require a .env file each, which would be included in the email. Please contact me if the .env file is not found.

## :hammer: 5. References and Tools Uses
1. [NextJS 14 Documentation](https://nextjs.org/docs)
2. [fastapi Documentation](https://fastapi.tiangolo.com/tutorial/first-steps/) (Especially the following entries: first steps, dependency and multiple files)
3. [Groq Documentation](https://console.groq.com/docs/quickstart)
4. [Groq Doc Chat](https://docs-chat.groqcloud.com/)
5. [SQLAlchemy Documentation](https://docs.sqlalchemy.org/en/20/index.html)
6. [Google](https://google.com)
7. [Bing AI](https://www.bing.com/chat) (Very minimal use, used only in advanced use of the SQLAlchemy ORM because the docs in SQLAlchemy is not that great)
