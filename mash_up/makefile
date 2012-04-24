all:
	clear
	coffee --output js/ --compile src/

watch:
	make
	watchr -e 'watch(".") {system "make"}'
