interface passwordStrength{
    id: number,
    status: string
}
function checkStrenght(value: string): passwordStrength {
    const regExpWeak = /[a-z]/
    const regExpMedium = /(?=.*\d)(?=.*[A-Z])/
    const regExpStrong = /.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/
    let strength = 0
        if(value.length <= 3 && (value.match(regExpWeak) || value.match(regExpMedium) || value.match(regExpStrong))) strength=0
        if(value.length >= 8 && ((value.match(regExpWeak) && value.match(regExpMedium)) || (value.match(regExpMedium) && value.match(regExpStrong)) || (value.match(regExpWeak) && value.match(regExpStrong)))) strength=1
        if(value.length >= 8 && value.match(regExpWeak) && value.match(regExpMedium) && value.match(regExpStrong)) strength=2
    if(value === "") return {
        id: 0,
        status: "Empty"
    }
        if(strength === 2) return {
        id:2,
        status: "Strong"
    }
    if(strength === 1) return  {
        id:1,
        status: "Medium"
    }
    return {
        id:0,
        status: "Weak"
    }
}

export {
    checkStrenght,
    passwordStrength
}