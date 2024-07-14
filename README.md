
<h1 align="center" id="title">Ianai-CLI</h1>

<p id="description">Ianai-CLI is a command-line tool designed to convert natural language into Shell commands.</p>

<p align="center">
   <a href="https://www.npmjs.com/package/ianai-cli"><img src="https://img.shields.io/npm/v/ianai-cli" alt="Current version"></a>
</p>


<img  src="https://github.com/user-attachments/assets/5ddc242c-c974-4935-8f61-4679133c3878" alt="Gif" />


## Installation

Install ianai-cli
```bash
npm install -g ianai-cli
```



## Usage

#### Note: Currently, only DeepSeek Chat is supported, API keys are not supported at this time.

1. Go to [Deepseek](https://chat.deepseek.com/) to get your Auth Token

![screenshot](https://github.com/user-attachments/assets/b4cd8f5c-e205-4742-8e11-e1d08d68ddc2)


2. Initialize Settings and set your auth token
```bash
ai --init
```

3. 
```bash
ai <your-input-message>
```

### Example

```bash
ai echo hello world!
```
You will then receive the following output, allowing you to either run the suggested command, copy it to the clipboard, or exit.

```bash
> echo hello world!
│
◆  Select one option:
│  ● Run command
│  ○ Copy to clipboard
│  ○ Exit
└
```
If you choose "Run command," you will get the following result:
```bash
> echo hello world!
│
◇  Select one option:
│  Run command
│
◇  ✅ Command executed result:

hello world!

```
Be aware that some shells treat specific characters such as ?, *, or anything resembling file paths in a unique way. If you encounter unexpected behaviors, you can prevent these issues by enclosing the prompt in quotes, as shown below:
```bash
ai "what is google's ip?"
```
## Configuration

The Ianai-CLI tool employs a structured settings schema to handle various configuration options. Here’s how to set up and comprehend the settings for the tool.

### File Location
The settings are stored in a JSON file located at `~/.ianai-cli/settings.json` You can manually edit this file, or run ai --init to set up or update the settings through a guided process.

### Settings Schema

The settings schema defines the configuration structure for integrating with various services. Below is the breakdown of each field:

- **endpoint** (Optional): A URL string required when using a custom service.
  
- **model_class** (Required): Specifies the model class to use. Example: `'deepseek_code'`. This field is mandatory and must be provided.

- **metadata** (Optional): Additional metadata information in key-value pair format. Can contain any type of value. This field is embedded directly into the prompt and is intended to allow the ai to remember user information

- **headers** (Optional): A record of strings for custom headers in each request. Each entry is a string value.

- **authToken** (Required): A string value of the authentication token.

### Command Syntax
 
```bash
ai config <action> <key> [value]
```
 - **action**: TSpecifies the action to perform. Valid options are `get`, `set`, or `del`.
 - **key**: The key to operate on.
 - **value**: The value to set for the key. This field is only required when the action is `set`.
  
####  Examples
- `ai config get all` (Get the full Settings)
- `ai config set authToken "your-auth-token" `
- `ai config get authToken="eyJ....."`
- `ai config del authToken`



## License

[MIT]("https://choosealicense.com/licenses/mit/")

