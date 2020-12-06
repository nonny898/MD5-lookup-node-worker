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
* [n-readlines - npm](https://www.npmjs.com/package/n-readlines)



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
   git clone https://github.com/nonny898/MD5-lookup-node-worker.git
   ```

 2. Install `n-readlines` module inside `md5-crack-lookup` folder:
```sh
cd md5-crack-lookup; npm install
```


<!-- USAGE EXAMPLES -->
## :computer: Usage

1. Navigate to `create-hashlist` folder:
```sh
cd create-hashlist
```
2.
	 * If you're running the notebook on your system, place the `rockyou.txt` in the same directory as `create_hash_text.ipynb` file.

	 * If you're using an an online Jupyter notebook, import the `create_hash_text.ipynb` and upload the `rockyou.txt` file to the notebook file system.

3. Run the notebook. This will create a text file called `hashed.txt`.

4. Move and paste the `hashed.txt` inside the directory `md5-crack-lookup`:
```sh
mv hashed.txt ../md5-crack-lookup
```

5. Navigate the `md5-crack-lookup` folder:
```sh
cd md5-crack-lookup
```

7. In the terminal, type in:
```sh
node index.js
```

8. You can change the hash to crack inside the `index.js` file where the variable name:

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
List of hashed used in this experiment:
 1. ad849a20dc8677403d4789595bd66877 = "4353492801"
 2. 2bc827ab00ea0175b6020e09de2ce98a = "gamapa2"
 3. b7474e70aa5d730490afaf4afc081d1c = "90019079"
 4. 0a23dfb1d5f5c1df5d260f69577255f2 = "push69pop"
 5. bf3ed3388451da8df8bf96086a360dc4 = "dalepedal"

| Type of Lookup | Hash 1 | Hash 2 | Hash 3 | Hash 4 | Hash 5 | Average |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| :arrow_right: Single Thread | 18.6s | 18.5s | 18.6s | 18.5s | 18.7s | **18.58s**
| :twisted_rightwards_arrows: Multiple Threads | 2.8s | 3.2s | 3.4s | 2.9s | 2.9s | **3.04s**

<!-- EXPLANATION -->
## :microscope: Explanation

### :mag: The Read File

We create a file called `getHash.js` dedicating to reading the `hashed.txt` file.

```javascript
const getHash = function() {
	const liner = new lineByLine('hashed.txt');
	const lines = [];
	let counter = 0
	while (line = liner.next()) {
		lines.push(line.toString())
		counter++
	}
	return {lines, counter}
}
```

### :construction_worker: The Workers

We are using the node build-in module called [**Worker threads**](https://nodejs.org/api/worker_threads.html). This module will enable the use of threads that execute Javascript in parallel using multiple CPU cores.

The number of threads we are spawning will be the input of the function:

```javascript
splitHash(n) // n = number of workers we want
```

For single thread test, we will still use the `worker_threads` module, but we will be setting the number of workers to have only one workers

```javascript
splitHash(1)
```

We still use the module to ensure that they will have the same environment in both cases.

For multi threads test, we will be setting the number of workers to have 8 workers. This is because in total we have 12 threads, but there will be some threads running in the backgrounds e.g. for the operating system. We can spawn more workers, but some of the workers will have to wait in a queue for other threads to finish up.

```javascript
splitHash(8)
```

All created workers will put in a promise:

```javascript
const createWorker = (arrayToFind,i) => {
	return new Promise((resolve, reject) => {
		const worker = new Worker('./lookup.js', { workerData: {
			workerId: i,
			arrayToFind,
			passToCrack,
		}});
		worker.on("message", resolve);
		worker.on("error", reject);
	});
};
```
This ensures that when we call `Promise.all(promises)` where promises where array of worker we create with the above function, all worker will be spawning and working at the same time.

### :bookmark_tabs: The Lookup Procedure

We create a function `crack(workerData)` in the `lookup.js` that takes in an object we passed during the `createWorker` function above.

```javascript
function crack(workerData) {
	console.log(`Start looking from thread number ${workerData.workerId}`)
	const newArray = workerData.arrayToFind.map((password) => {
		if (password.split(" ")[0] === workerData.passToCrack) passwordFound = password.split(" ")[1]
		return password.split(" ")[0] ===  workerData.passToCrack
	})
	if (newArray.includes(true)) { return {found: true, password: passwordFound, end: performance.now()}}
	else {return {found: false, password: "Not in database."}}
}
```

We are using the native Javascript `.map()` function to create a new array with either true or false value depending on whether each element (lines) contains the hash we are looking for or not.

### :scissors: The Split-up

We are splitting up the hash list into chunks according to the number to workers we have:

```javascript
const segmentsPerWorker = Math.round(hashedListSize  /  workers);
```
This will determine **how many lines** each worker has look through (except for the last worker).

For **single thread** environment, the worker will have to map all lines.

For **multi thread** environment, each worker will be **given number of lines** depending on how many workers we are spawning to look for the hash.
```javascript
if (index === 0) { // index = worker number
	// the first segment
	arrayToFind = hashList.slice(0, segmentsPerWorker);
} else  if (index === workers - 1) {
	// the last segment
	arrayToFind = hashList.slice(segmentsPerWorker * index);
} else {
	// intermediate segments
	arrayToFind = hashList.slice(segmentsPerWorker * index,segmentsPerWorker * (index + 1))
```
For the last worker, it will be given the lines from `segmentsPerWorker * index` till the end of the list. The amount of lines could be either **smaller or bigger or equal** to other workers.

If the hash is in the dictionary, the terminal will display:
```sh
Password = (some password plain text).
Found in (time it takes to look for the password)
```
Otherwise, the terminal will display:
```sh
Password = Not in database.
Found in (time it takes to look through all the lines)
```

### :straight_ruler: Benchmarking

We used a module called [**Performance measurement APIs**](https://nodejs.org/api/perf_hooks.html) which is a build-in module in Node.js for measuring performance. The function used to measure is `performance.now()` where it returns the current high resolution millisecond timestamp. We will call this function two times:

1. In the main thread, just before spawning the first worker.
2. In the worker thread when each worker finishes.

Because reading the whole `hashed.txt` file takes the longest time, we are not taking to account of the time taken to read the file.

<!-- EVALUATION -->
## :balance_scale: Evalution

>Workers (threads) are useful for performing CPU-intensive JavaScript operations.
>They will not help much with I/O-intensive work.
>Node.js’s built-in asynchronous I/O operations are more efficient than Workers can be.

From the words of the documentation itself, I/O operation should not be dealt with workers. Furthermore, the bottleneck of this project purely caused by reading a huge file into the memory. At first we made a mistake with using Node `readFileSync()` function which will read the whole file into the memory and return a buffer. However, when we tried to produce a list from this buffer using `toString().split('\r\n')`, the string was too long for Node to handle. This is why we result to use the external module instead.

On the contrary, we have found significant improve in looking up with parallelism and the use of worker threads. Therefore, making this project to be successfully showing the advantage of using parallel programing.

<!-- CONTACT -->
## :envelope_with_arrow: Contact

Atichard Chintakanond - a.chintakanond@gmail.com