
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return { ...state,status : action.status }
            case 'APP/SET-ERROR':
                return { ...state,error : action.value }
        default:
            return state
    }
}




 export const setAppStatusAC = (status: RequestStatusType) =>({
     type: 'APP/SET-STATUS',
     status,
   } as const);

   export const setAppErrorAC = (value:null|string) => ({
    type:'APP/SET-ERROR',
    value
    } as const);

 export type SetAppStatusTypeAC = ReturnType <typeof setAppStatusAC>
 export type SetAppErrorTypeAC = ReturnType <typeof setAppErrorAC>

type ActionsType = SetAppStatusTypeAC | SetAppErrorTypeAC