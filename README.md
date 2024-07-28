<h1 align="center" id="title">Ianai-CLI</h1>

<p id="description" align="center">Ianai-CLI is a command-line tool designed to convert natural language into Shell commands.</p>

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

#### Note: Currently, only DeepSeek Chat is supported, API keys are currently unsupported.

1. Go to [Deepseek](https://chat.deepseek.com/) to get your Auth Token

![screenshot](https://github.com/user-attachments/assets/95cff635-7fac-4aae-bd41-98cce835a8d0)

2. Initialize Settings and set your auth token

```bash
ai --init
```

3.

```bash
ai <your-input-message>
```

### Command Generation

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

Be aware that some shells treat specific characters such as ?, \*, or anything resembling file paths in a unique way. If you encounter unexpected behaviors, you can prevent these issues by enclosing the prompt in quotes, as shown below:

```bash
ai "what is google's ip?"
```

### Commit Message Generation

Stage your files and use `ai commit`
```bash
git add .
ai commit
```

Occasionally, the suggested commit message may not be ideal, so you might want to generate several options to choose from. You can produce multiple commit messages simultaneously by using the `-g <i>` flag, where 'i' specifies the number of messages to generate:

```bash
ai commit -g <i> # or -generate <i>
```


```bash
ai commit -g 5 #or --generate 5
```

You can also set a maximum length for each message (up to 100 characters).

```bash

ai commit  -m 100 #or --maxlength 100

```

Of course, you can also set it up together according to the following:

```bash
ai commit -g 5 -m 100 #or --generate 5 --maxlength 100
```

Additionally, you can use the `-t` flag to specify the commit message format:

```bash
ai commit -t conventional #or --type conventional
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
- **commitment** (Optional): Customizes the generation of commit messages. Default values are:
  - `generate`: 1
  - `maxlength`: 60
  - `type`:`""`Defaults to an empty string, if the type is `conventional`, the submission information will be formatted according to the regular submission specification

### Command Syntax

```bash
ai config <action> <key> [value]
```

- **action**: Specifies the action to perform. Valid options are `get`, `set`, or `del`.
- **key**: The key to operate on.
- **value**: The value to set for the key. This field is only required when the action is `set`.

#### Examples

- `ai config get all` (Get the full Settings)
- `ai config set authToken="...."`
- `ai config del authToken`


## Credit
- We also credit Hassan and his work on [aicommits](https://github.com/Nutlope/aicommits) for inspiring the commit message automation feature in this project.

## License

[MIT]("https://choosealicense.com/licenses/mit/")
