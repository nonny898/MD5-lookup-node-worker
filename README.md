# OPL Project - MD5 Lookup with Node.js Worker Threads

## :smiley: Introduction

This project was created for a course called Functional and Parallel Programming. The purpose of this project is to explore the parallel side of Javascript. The project will be focusing on the speed in looking up MD5 hash **(without salting)** for the equivalent password. 

Brute forcing a de-convert a MD5 hash can be very time consuming and limited amount of characters **if someone were to see the result quickly**.

Here's why:
* You'll have to go through every combination of **alphanumerical:** 
	* (0-9, lowercase, uppercase, **symbols** such as @ # * and &)
* The more characters you have the more combinations you'll have to go through.
	* Adding a single character to a password boosts its security exponentially.

This project will use the concept of a **rainbow table attack** - a type of hacking where attacker will use a rainbow hash **(in this case, MD5)** table to crack an MD5 hash for passwords stored in a database system. This is still brute forcing, but instead looking for the right combination, it will look through known passwords hash and it's value (the password in plain text).

### :hammer: Built With

The frameworks and libraries used in this project are: 
* [pandas - Python Data Analysis Library (pydata.org)](https://pandas.pydata.org/)
* [hashlib - Secure hashes and message digests](https://docs.python.org/3/library/hashlib.html)
* [Node.js - a JavaScript runtime built on Chrome's V8 JavaScript engine](https://nodejs.org/en/)



<!-- GETTING STARTED -->
##  :rocket:Getting Started

### :page_facing_up: Prerequisites

Firstly, you will need [Common Password List ( rockyou.txt )](https://www.kaggle.com/wjburns/common-password-list-rockyoutxt) file that contains **14,341,564 unique** passwords, used in **32,603,388 accounts**. This file was taken from the following location: /usr/share/wordlists/rockyou.txt.gz from Kali Linux operating system. Kali Linux provides some password dictionary files as part of its standard installation.

**Disclosure:** Kali Linux is an open source project that is maintained and funded by Offensive Security, a provider of world-class information security training and penetration testing services.

Secondly, you will need to have Node.js install in you system. If not, you can download the framework from [here](https://nodejs.org/en/download/)

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your API in `config.js`
   ```JS
   const API_KEY = 'ENTER YOUR API';
   ```

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)
