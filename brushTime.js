
const path = document.getElementById('path');
const squaresGroup = document.getElementById('squares');
const button= document.getElementById("button");

// Define the number of squares
const numSquares = 14;

// Get total path length
const pathLength = path.getTotalLength();

// Create squares and position them along the path
for (let i = 0; i < numSquares; i++) {
    // Calculates point by multiplying the index by t of the path length

    const t = i / (numSquares - 1);
    
    const lengthAtT = t * pathLength;
    const point = path.getPointAtLength(lengthAtT);

    
    let angle;
    // since there are no point before the first square angle is set to -90
    if(i==0){
        angle=-90
        
    } else {
        // For the last square, use a backward delta
        const prevPoint = path.getPointAtLength(lengthAtT-1);
        // calculate the the angle between the points and 180/Math.PI is to convert radians to degrees
        angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x) * (180 / Math.PI);
    }

    const sideHeight=13;
    const middleHeight=24;
    const toothWidth=50
    
    const frontTooth=createToothPart(toothWidth,sideHeight*2,10,point,-sideHeight-middleHeight,angle);
    frontTooth.setAttribute("id", `f${i}`);
    const backTooth=createToothPart(toothWidth,sideHeight*2,10,point,-sideHeight,angle);
    backTooth.setAttribute("id", `b${i}`);
    const middleTooth=createToothPart(toothWidth,middleHeight,0,point,-middleHeight,angle);
    middleTooth.setAttribute("id", `m${i}`);
    
    squaresGroup.appendChild(frontTooth);
    squaresGroup.appendChild(backTooth);
    squaresGroup.appendChild(middleTooth);
        
}

function createToothPart(width,height,rx,point,y,angle){
        const toothPart = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        toothPart.setAttribute('width', width);
        toothPart.setAttribute('height', height);
        toothPart.setAttribute("rx",rx);

        toothPart.setAttribute('fill', 'white');
        toothPart.setAttribute("stroke","black");
        toothPart.setAttribute("class","tooth")

        toothPart.setAttribute('x', point.x - width/2); // Center the square (half its width)
        toothPart.setAttribute('y', point.y+y ); // Offset the square vertically by y
        toothPart.setAttribute('transform', `rotate(${angle} ${point.x} ${point.y})`);

        return toothPart;

}
            
        
async function loopTroughSide(type,time,from=0,to=numSquares,reverse=false,color="green"){
    let tooth;
    let i=from;
    let r=to-1;
    let typeNumber=i;
    while((r >=from) && (i<= to-1)) {

        if(reverse){
            typeNumber=r;
            r--;
        }
        else{
            typeNumber=i;
            i++;
        }
        tooth = document.getElementById(`${type}${typeNumber}`);
        tooth.setAttribute('fill', `${color}`);
        await new Promise(resolve => setTimeout(resolve, time));
    }
}

async function brushTimer(){
    let time=(60*1000)/(numSquares*3);
    let flip=false
    let values=[[0,(numSquares/2)],[(numSquares/2),numSquares]]
    let days=daysFromEpoch();
    let days4=days%4

    if(days4%2!=0){
        values=[[(numSquares/2),numSquares],values[0]]
        flip=!flip
    }

    let buttonText=["Lower","Upper"]
    if(days4>1){
        buttonText=[buttonText[1],buttonText[0]]
    }
    
    for(let i=0;i<2;i++){
        button.textContent=buttonText[i]

        for(let y=0;y<2;y++){
            let from=values[y][0]
            let to=values[y][1]
            await loopTroughSide("f",time,from,to,flip);
            await loopTroughSide("m",time,from,to,!flip);
            await loopTroughSide("b",time,from,to,flip);
        }
        await reset();
    }
    button.textContent="Start"
}

function reset(){
    const teeth = document.querySelectorAll(".tooth");
    teeth.forEach(tooth => tooth.setAttribute('fill', 'white'));
}

function daysFromEpoch(){
    const msSinceEpoch=Date.now();
    const msInADay=1000*60*60*24;
    const daysSinceEpoch= Math.floor(msSinceEpoch/msInADay);
    return daysSinceEpoch
}
button.addEventListener("click",()=>{
    brushTimer()
})
