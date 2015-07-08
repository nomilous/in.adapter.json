objective 'json parse', (should) ->

    trace.filter = true

    before ->

        global.$$in ||=
            adapters: {}

    beforeEach ->

        @opts = {}
        @inArgs = {}
        @arg = {}
        @results = [{
            adapters: []
            value: ''
            toString: -> 'in action'
        }]

    it 'parses json', (Module) ->

        @results[0].value = '{"key":"value"}'

        Module @opts, @inArgs, @arg, @results

        @results[0].value.should.eql key: 'value'


    it 'parses json in a data event stream', (Module, done) ->

        @results[0].adapters = ['stream']

        @results[0].value = on: (e, f) ->

            if e == 'data' 
                process.nextTick -> 
                    f '{"key":"value"}'

        Module @opts, @inArgs, @arg, @results

        @results[0].value.on 'data', (data) ->

            data.should.eql key: 'value'
            done()

    it 'ignores the tail of a previous object', (Module, done) ->

        @results[0].adapters = ['stream']

        @results[0].value = on: (e, f) ->

            if e == 'data' 
                process.nextTick -> 
                    f 'ey":"value1"}{"key":"value2"}'

        Module @opts, @inArgs, @arg, @results

        @results[0].value.on 'data', (data) ->

            data.should.eql key: 'value2'
            done()

        @results[0].value.on 'error', (e) ->

            # console.log e
