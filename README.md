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

1. You will need [Common Password List ( rockyou.txt )](https://www.kaggle.com/wjburns/common-password-list-rockyoutxt) file that contains **14,341,564 unique** passwords, used in **32,603,388 accounts**. This file was taken from the following location: /usr/share/wordlists/rockyou.txt.gz from Kali Linux operating system. Kali Linux provides some password dictionary files as part of its standard installation.

	**Disclosure:** Kali Linux is an open source project that is maintained and funded by Offensive Security, a provider of world-class information security training and penetration testing services.

2. You will need to have **Node.js** install in you system. If you haven't yet, you can download the framework from [here](https://nodejs.org/en/download/).  To verify Node.js installation:
```sh
node-v
```
The terminal should display the Node.js version.

3. To create our dictionary file (hash and password in the same line), I've implement a **Jupyter notebook** to do this. I recommend installing [Anaconda | Individual Edition](https://www.anaconda.com/products/individual) to your system to get the latest Python version. If you do not want to install anything into your system, there are multiple Jupyter notebook available online such as [Google Colab](https://colab.research.google.com/). Once you have the notebook running, input the following code in download and install pandas library:
```python
!pip install pandas
```
We do this to be sure that your notebook have pandas installed.

### :pencil2: Installation

 1. Clone the repo
   ```sh
   git clone https://github.com/nonny898/opl-project.git
   ```
   
<!-- USAGE EXAMPLES -->
## :computer: Usage

1. Navigate to `create-hashlist` folder 

2. 
	 * If you're running the notebook on your system, place the `rockyou.txt` in the same directory as `create_hash_text.ipynb` file.  

	 * If you're using an an online Jupyter notebook, import the `create_hash_text.ipynb` and upload the `rockyou.txt` file to the notebook file system.
 
3. Run the notebook. This will create a text file called `hashed.txt`.

4. Move and paste the `hashed.txt` inside the directory `md5-crack-lookup`.

5. Navigate the `md5-crack-lookup` folder.

6. In the terminal, type in either:

	* `node single-thread.js` for single thread lookup 
	* `node multi-thread.js` for parallel lookup.

8. You can change the hash to crack inside both the `single-thread.js` and `multi-thread.js` file where the variable name:

```javascript
const passToCrack = "" //some MD5 password hash
```

<!-- CONTRIBUTING -->
## :chart_with_upwards_trend: Result

The test was conducted on:

```sh
CPU = AMD Ryzen 5 2600X Six-Core Processor 
	  Base speed: 3.60 GHz
      Cores: 6
	  Logical processors: 12
RAM = 16.0 GB
      Speed: 2400 MHz
	  Form factor: DIMM
```

### :arrow_right: Single Thread

| MD5 Hash | Plain text | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Average |
| ------- |:----------:| ------:|:------:| ------:| ------:| ------:| -------:|
|  |  |  |
|  |  |  |
|  |  |  |

### :twisted_rightwards_arrows: Multiple Threads

| MD5 Hash | Plain text | Test 1 | Test 2 | Test 3 | Test 4 | Test 5 | Average |
| ------- |:----------:| ------:|:------:| ------:| ------:| ------:| -------:|
|  |  |  |
|  |  |  |
|  |  |  |

<!-- EXPLANATION -->
## :microscope: Explanation

### :construction_worker: The Workers

We are using the node build-in module called **Worker threads**. This module will enable the use of threads that execute Javascript in parallel using multiple CPU cores.

For single thread test, we will still use the `worker_threads` module, but we will be setting the number of workers to have only one workers

```javascript
const  numWorkers  =  1
```

We still use module to ensure that they will have the same environment in both cases.

For multi threads test, we will be setting the number of workers to have 8 workers. This is because in total we have 12 threads, but there will be some threads running in the backgrounds e.g. for the operating system. We can spawn more workers, but some of the workers will have to wait in a queue for other threads to finish up. 

All created workers will put in a list.

```javascript
const  numWorkers  =  8
```

### :bookmark_tabs: The Lookup Procedure

For **single thread** environment, the worker will have to through all 14,343,472 lines in the `hashed.txt` file to look for hash and it's plain text.

For **multi thread** environment, each worker will be **given 100 lines** to look for the hash. This means that at the one time, we will looking up 800 lines concurrently. 

* If one worker found the hash and it's plain text, we will **terminate** those other workers.

* If one worker finishes looking up in the given lines and still haven't found the hash, it will be given the next 100 lines after the 700 lines given to the other workers.

The number lines given to each workers can be change in `multi-thread.js`:

```javascript
const startingPoint = {0: 0,
					   1: 100,
					   2: 200,
					   3: 300,
					   4: 400,
					   5: 500,
					   6: 600,
					   7: 700}
```

Each key representing the worker ID and the value is the number of lines given to those workers. For simplicity, we have chosen the number of lines to have the same interval. Otherwise, it will more complicated to tell the program how many lines to skip.



<!-- EVALUATION -->
## :balance_scale: Evalution


<!-- CONTACT -->
## :envelope_with_arrow: Contact

Atichard Chintakanond - a.chintakanond@gmail.com
