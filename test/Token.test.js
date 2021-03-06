
import { tokens } from "./Helpers"
import {EVM_REVERT} from "./Helpers"
const Token = artifacts.require("./Token")

require('chai')
.use(require("chai-as-promised"))
.should()



contract('Token', ([deployer, receiver, exchange]) => { 
    const name ='Yog'
    const symbol = 'YOG'
    const decimals = '18'
    const totalSupply = tokens(1000000).toString()
    let token

    //fetch token this allows us to call and chec on token whenever we want to without having to run it each time we run truffle test 
    beforeEach (async () => {
        token = await Token.new()
    })

    describe('deployment', () => {
        it('tracks the name', async () => {
            //read token name 
            const result = await token.name()
            //token name is "gl"
            result.should.equal(name)
        })

        it('tracks the symbol', async() => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })

        it('tracks the decimals', async() => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })

        it ('tracks the total supply', async() => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply)
        })

        it ('assigns the total supply to the deployer', async() => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply.toString())

            //always make sure you are using the same value with Chai to check 
            //i.e. toString agaisnt toStrong (53-55 example)
    })
})
    describe('sending tokens', () => {
        let result
        let amount

        describe("success", async () => {
            beforeEach (async () => {
                //balance transfer
                amount = tokens(100)
                result = await token.transfer(receiver,amount, {from: deployer})        
            })
          
            it("transfers token balances", async () => {
                let balanceOf
                //balance before transfer
                // balanceOf = await token.balanceOf(deployer)
                // balanceOf = await token.balanceOf(receiver)

                //after transfer
                balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString())
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString())
            })

            it("emits a transfer event", async () => {
                const log = result.logs[0]
                log.event.should.eq("Transfer")
                const event = log.args
                event.from.toString().should.equal(deployer, "from is correct")
                event.to.should.equal(receiver, "to is correct")
                event.value.toString().should.equal(amount.toString(), "value is correct")
            })
        })

        describe('failure', async () => {
            it('rejects insufficient balances', async () => {
                let invalidAmount
                //token amount is to test for failure
                invalidAmount = tokens(10000000000) 
                await token.transfer(receiver, invalidAmount, {from: deployer}).should.be.rejectedWith(EVM_REVERT);

                //Attemp to transfer tokens with a zero balance
                invalidAmount = tokens(10)
                await token.transfer(deployer, invalidAmount, { from: receiver}).should.be.rejectedWith(EVM_REVERT);
            })

            it('rejects invalid recipients', async () => {
                await token.transfer(0x0, amount, { from: deployer}).should.be.rejected
            })
        })
        })

    describe('approving tokens', () => {
        let result 
        let amount 

        beforeEach(async () => {
            amount = tokens(100)
            result = await token.approve(exchange, amount, { from: deployer})
        })

     describe('success', () => {
         it('allocates on allowance for delegated token spending on an exchange', async () => {
             const allowance = await token.allowance(deployer, exchange)
             allowance.toString().should.equal(amount.toString())
         })

         it("emits an approval event", async () => {
            const log = result.logs[0]
            log.event.should.eq('Approval')
            const event = log.args
            event.owner.toString().should.equal(deployer, "owner is correct")
            event.spender.should.equal(exchange, "spender is correct")
            event.value.toString().should.equal(amount.toString(), "value is correct")
        })

     })
     describe('failure', () => {
         it ('rejects invalid spenders', async () => {
            await token.approve(0x0, amount, { from: deployer}).should.be.rejected
         })

     })
    })



    //this test covers an amount going from the sender to a reciver 
    //via the exhange and this can happen because the exchange has 
    // been approved for this transaction
 
    describe('delegated token transfers', () => {
        let result
        let amount
    
        beforeEach(async () => {
          amount = tokens(100)
          await token.approve(exchange, amount, { from: deployer })
        })
    
        describe('success', () => {
          beforeEach(async () => {
            result = await token.transferFrom(deployer, receiver, amount, { from: exchange })
          })
    
          it('transfers token balances', async () => {
            let balanceOf
            balanceOf = await token.balanceOf(deployer)
            balanceOf.toString().should.equal(tokens(999900).toString())
            balanceOf = await token.balanceOf(receiver)
            balanceOf.toString().should.equal(tokens(100).toString())
          })

          it('resets the allowance', async () => {
            const allowance = await token.allowance(deployer, exchange)
            allowance.toString().should.equal('0')
        })

            it("emits a transfer event", async () => {
                const log = result.logs[0]
                log.event.should.eq("Transfer")
                const event = log.args
                event.from.toString().should.equal(deployer, "from is correct")
                event.to.should.equal(receiver, "to is correct")
                event.value.toString().should.equal(amount.toString(), "value is correct")
            })
        })

        describe('failure', async () => {
            it('rejects insufficient balances', async () => {
                let invalidAmount
                //token amount is to test for failure
                invalidAmount = tokens(10000000000) 
                await token.transfer(deployer, receiver, invalidAmount, {from: exchange}).should.be.rejectedWith(EVM_REVERT);

            //     //Attemp to transfer tokens with a zero balance
            //     invalidAmount = tokens(10)
            //     await token.transfer(deployer, invalidAmount, { from: receiver}).should.be.rejectedWith(EVM_REVERT);
            })

        describe('falure', () => {
            it ('rejects invalid recipients', async () => {
                await token.tanserFrom (deployer, 0x0, amount, { from: exchange}.should.be.rejected)
            })
        })
       
        })
        })
    })