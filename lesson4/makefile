all:
	coffee --output js/ --compile src/
	mocha -u tdd -R list

watch:
	make
	watchr -e 'watch(".") {system "make"}'
