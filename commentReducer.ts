export function removeComments(contents: string){
    const qs=(contents+" ").split("")
    const nsl = removeSingleLine(qs)
    const nml = removeMultiLine(nsl)
    console.log(nml.join(""))
    return nml
    
}

export function removeSingleLine(contents: string[]){
    const h = "u3498urt891349f" 
    let co = 0;
    const src = new Array<string>()
    let inString = false
    while (co!=(contents.length)){
        if(contents[co] == '"' && !inString){
            src[co] = contents[co]
            co++
            inString = true
        }else if (contents[co] == '"' && inString){
            inString = false
        }
        if (
            `${contents[co]}${contents[co+1]}` == "??" && !inString
        ){
            while (contents[co] != '\0' && contents[co] != '\n' && !inString){
                if (inString) {break}
                if (co+1>(contents.length-1)){break;}else{co++;}
                src[co] = h
            }
            // if (co+1>(qs.length-1)){break;}else{co++;}
        }else{
            src[co] = contents[co]
            if (co+1>(contents.length-1)){break;}else{co++;}
        }

    }

    
    return src.join("").replaceAll(h, "").split("")
}

export function removeMultiLine(contents: string[]){
    const h = "u3498urt891349f" 
    let co = 0;
    const src = new Array<string>()
    let inString = false
    while (co!=(contents.length)){
        if(contents[co] == '"' && !inString){
            src[co] = contents[co]
            co++
            inString = true
        }else if (contents[co] == '"' && inString){
            inString = false
        }
        if (
            `${contents[co]}${contents[co+1]}` == "-?" && !inString
        ){
            src[co] = h
            while (contents[co] != '\0' && !inString){
                if (inString) {break}
                if (co+1>(contents.length-1)){break;}else{co++;}
                if (`${contents[co]}${contents[co+1]}` != "?-"){
                    src[co] = h
                }else{
                    break
                }
            }
            if (co+1>(contents.length-1)){break;}else{co++;}
            src[co+1] = h
            if (co+1>(contents.length-1)){break;}else{co++;}
            src[co+1] = h
            // if (co+1>(qs.length-1)){break;}else{co++;}
        }else{
            src[co] = contents[co]
            if (co+1>(contents.length-1)){break;}else{co++;}
        }

    }

    
    return src.join("").replaceAll(h, "").split("")
}