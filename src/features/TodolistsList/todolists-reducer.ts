import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import { RequestStatusType, setAppErrorAC, SetAppErrorTypeAC, setAppStatusAC, SetAppStatusTypeAC } from '../../app/app-reduser'
import { AxiosError } from 'axios'

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
  ):
 Array<TodolistDomainType> => {
  switch (action.type) {

    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);

    case "ADD-TODOLIST":
      return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state];

    case "CHANGE-TODOLIST-TITLE":
      return state.map((tl) => (tl.id === action.id ? { ...tl, title: action.title } : tl));

    case "CHANGE-TODOLIST-FILTER":
      return state.map((tl) => (tl.id === action.id ? { ...tl, filter: action.filter } : tl));

    case "SET-TODOLISTS":
      return action.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));

    case "SET-ENTITY-STATUS":
      return state.map(t=>t.id===action.id?{...t,entityStatus:action.entityStatus}:t)

    default:
      return state;
  }
};

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)

export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)

export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)

export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)

export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

export const changeTodolistEntityStatusAC = (id:string,entityStatus:RequestStatusType)=> ({
    type:'SET-ENTITY-STATUS',
    id,
    entityStatus
} as const)

// thunks
export const fetchTodolistsTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        
       todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        dispatch (changeTodolistEntityStatusAC(todolistId,'loading'))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC(todolistId))
                dispatch (setAppStatusAC('succeeded'))
            })
            .catch(()=>{
                dispatch (changeTodolistEntityStatusAC(todolistId,'idle'))
            })

            
    }
}
export const addTodolistTC = (title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0){
                    dispatch(addTodolistAC(res.data.data.item))
                }
                else{
                    if(res.data.messages.length){
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    }else{
                        dispatch(setAppErrorAC('Some Error'))
                    }
                }
            })
            .catch ((e:AxiosError) => {
                dispatch(setAppErrorAC(e.message))
            })
            .finally(()=> {
                dispatch(setAppStatusAC('idle'))
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.updateTodolist(id, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(id, title))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

// types

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | SetTodolistsActionType
    | SetAppStatusTypeAC
    | SetAppErrorTypeAC
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType &
 { filter: FilterValuesType , entityStatus:RequestStatusType}
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
