#!/usr/bin/env node

/*
 * Copyright (c) 2020 - present Nimbella Corp.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

// Utility to apply minor fixes to docs generated by oclif-dev readme --multi

const fs = require('fs')
const path = require('path')

// Fix up the contents.  Initially just turn colon separators into blank separators.
function fixup(docText, topic, aliases) {
	console.log('fixing', topic)
	// Replace all occurrences of topic + ':' with topic + ' '
	let before = topic + ':'
	let after = topic + ' '
	docText = docText.split(before).join(after)
	// Now do the same for each alias
	if (Array.isArray(aliases)) {
		for (const alias of aliases) {
			before = alias + ':'
			after = alias + ' '
			docText = docText.split(before).join(after)
		}
	}
	// Now correct the references in the toc.  Change `nim-topic` to `nim-topic-`
	before = '#nim-' + topic
	after = before + '-'
	docText = docText.split(before).join(after)
	return docText
}

// Main logic
if (process.argv.length !== 4) {
     console.error("wrong number of arguments")
     process.exit()
}
const doc = process.argv[2]
const pj = process.argv[3]
const packageJsonText = fs.readFileSync(pj)
const packageJSON = JSON.parse(packageJsonText)
const topic = path.basename(doc, '.md')
if (topic in packageJSON.oclif.topics) {
	const docText = String(fs.readFileSync(doc))
	const fixed = fixup(docText, topic, packageJSON.oclif.topics[topic].aliases)
	fs.writeFileSync(doc, fixed)
}
