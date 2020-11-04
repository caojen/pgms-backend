
export function getUserType(user: any) {
  if(!user) {
    return null;
  } else {
    const enums = ['student', 'teacher', 'admin', 'bistuent'];
    for(const item in enums) {
      if(!!user[enums[item]]) {
        return enums[item];
      }
    }
  }
}
