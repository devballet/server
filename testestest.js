
var stage = [1,2,1,4,5]
var N = 7;
var list = [];
var listResult = [];

for( let i = 1; i< N+1; i++)
{
    var count = 0;
    var countMy = 0;
    stage.forEach(element => {
        if ( i <= element)
        {
            count ++;
        }
        if ( element == i)
        {
            countMy ++;
        }
    });


    if ( count == 0){
        list.push(0);
    }
    else{
        list.push(countMy/count);
    }

    

   

}

console.log(list);


for( let i = 0; i< N; i++)
{
    var value = Math.max.apply(null, list);
   
    var maxCoutValue = -1;
    for( let j = 0; j < N; j++){
        
        if ( list[j] == value){
            maxCoutValue = j;
        }
        if ( maxCoutValue != -1)
        {
            break;
        }
    }
    listResult.push(maxCoutValue+1);
    list[maxCoutValue] = -1;
}

console.log(listResult);