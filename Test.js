// Civitas Score Calculator
// Each of the categories are weighted equally

var custAcq, credScore, revenue, age, score = 0;

var name1;
var acq;
var rev;
var totalScore;
var loc;
var failRate;
var regionalPol;
var comImpact;
var regionNum;

var rentInc; //lowers score if the binary variable is 1, as it indicates there is a minimum 5% rent increase from 2012-2018
var rentDec; //increase score if the binary variable is 1, as it indicates there is a minimum 5% rent decrease from 2012-2018
var disp; //binary variable that indicates if a region is experiencing ongoing displacement

console.log ("\nWelcome to the Civitus Fund Evaluation!");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


readline.question('What is your name?', name => {
    readline.question('Which city is your business located in?', busLoc => {
        readline.question('Which region is your business located in? Input the number \n 0.Anza Vista \n 1.Hayes Valley \n 2.Japantown', regNum => {
            readline.question('What is the cost of customer acquisition?', acqAmt => {
                readline.question('What is your annual revenue?', revAmt => {
                    readline.question('What is the credit score of your business?', credAmt => {
                        console.log(`Hey there${name}!`);
                        name1 = name;
                        getName(name1);

                        console.log(`You have indicated that your business is in ${busLoc}!`);
                        loc = busLoc;
                        getLocation(loc);

                        console.log(`You have indicated that your business region is ${regNum}!`);
                        regionNum = parseFloat(regNum);
                        getRegionNum(regionNum);

                        console.log(`The cost you have inputted is: ${acqAmt}!`);
                        acq = parseFloat(acqAmt);
                        getCostAcq(acq);


                        console.log(`The revenue you have inputted is: ${revAmt}!`);
                        rev = parseFloat(revAmt);
                        getRev(rev);

                        console.log(`The credit score you have inputted is: ${credAmt}!`);
                        credScore = parseFloat(credAmt);
                        getCred(credScore);

                        fs.createReadStream('data.csv')
                            .pipe(csv())
                            .on('data',(row)=>{
                                if(row["location"]==regionNum){
                                    rentInc = parseFloat(row["rent_increase"]);
                                    getRentIncrease(rentInc);

                                    rentDec = parseFloat(row["rent_decrease"]);
                                    getRentDecrease(rentDec);

                                    disp = row["typ_cat"];
                                    getDisplacement(disp);
                                }
                            })
                            .on('end',()=>{
                            })

                        readline.close();
                    });
                });
            });
        });
    });
});

getPol(regionalPol);
getComImpact(comImpact);

function getName(n){
}

// Most recent date of small business failure rate in major regions across the US
// https://www.weforum.org/agenda/2020/10/mapped-uneven-recovery-us-america-small-businesses-closure
function getLocation(locName){
    if (locName == 'San Francisco'){
        failRate = .5;
    }
    if (locName == 'New York'){
        failRate = .21;
    }
    if (locName == 'Kansas City'){
        failRate = .15;
    }
    if (locName == 'Austin'){
        failRate = .32;
    }
    if (locName == 'Miami'){
        failRate = .23;
    }
    if (locName == 'Honolulu'){
        failRate = .41;
    }

    if (failRate <= .1) {
        score += 12.5;
    }
    else if (failRate > .1 && failRate < .2) {
        score += 10;
    }
    else if (failRate >= .2 && failRate < .3) {
        score += 7.5;
    }
    else if (failRate >= .3 && failRate < .4) {
        score += 5;
    }
    else if (failRate >= .4 && failRate < .5) {
        score += 2.5;
    }


}

function getRegionNum(regionNum){
}




// Benchmark of customer acquisition costs is $10 for retail businesses
// https://www.propellercrm.com/blog/customer-acquisition-cost
// https://www.demandjump.com/blog/customer-acquisition-cost-by-industry
function getCostAcq(custAcq){
    if (custAcq <= 7.5) {
        score += 12.5;
    }
    else if (custAcq > 7.5 && custAcq < 10) {
        score += 10;
    }
    else if (custAcq >= 10 && custAcq < 12.5) {
        score += 7.5;
    }
    else if (custAcq >= 12.5 && custAcq < 15) {
        score += 5;
    }
    else if (custAcq >= 15 && custAcq < 17.5) {
        score += 2.5;
    }

}

// Benchmarked against the average salary of a small business which is $115,000/year
// https://www.payscale.com/research/US/Job=Small_Business_Owner_%2F_Operator/Salary/cebf52db/San-Francisco-CA
function getRev(revNum){
    if (revNum >= 200000){
        score += 12.5;
    }
    else if (revNum >= 150000 && revNum < 200000) {
        score += 10;
    }
    else if (revNum >= 100000 && revNum < 150000) {
        score += 7.5;
    }
    else if (revNum >= 50000 && revNum < 100000) {
        score += 5;
    }
    else if (revNum >= 10000 && revNum < 50000) {
        score += 2.5;
    }

}

// US Credit Scores are calculated on a scale of 100
// Each factor is weighed equally to total to 100
// As there are 8 factors, we simply divide 100 by 8
function getCred(credScore){
    credScore = credScore/8;
    score += credScore;
}

// Using the example of the San Francisco Bay Area,
// Restrictive policies due to land size and rent makes its policy score low
function getPol(regionalPol){
    regionalPol = 5;
    score += regionalPol;
}

//Using the example of Talisa's restaurant
//Central part of the community and is a well-known cultural hub in the SF Bay Area
function getComImpact(comImpact){
    comImpact = 10;
    score += comImpact;
}

function getRentIncrease(r){
    if (r==1){
        score += 1;
    }
}

function getRentDecrease(g){
    if (g==1){
        score += 12.5;
    }
}

function getDisplacement (d){
    if (d != 'OD'){
        score += 12.5;
    }
    console.log("d is" + d);
    console.log("Your total score is:" + score);

    if (score >= 70) {
        console.log("Yuo have passed the preliminary Civitas Screening and will be invited to an in-person interview!");
    }
    else {
        console.log("You currently do not meet the preliminary requirements for Civitas and we invite you to apply again at a later date.");
    }
}

const csv=require('csv-parser');
const fs=require('fs');




