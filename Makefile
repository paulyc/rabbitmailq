_: run

Maildir:
	mkdir -p Maildir/tmp Maildir/new Maildir/cur

Maildir_clean:
	rm -rf Maildir

clean: Maildir_clean

node_modules: package.json
	npm install

install:
	npm install -g

run: Maildir index.js
	node index.js

test: test.js
	node test.js

