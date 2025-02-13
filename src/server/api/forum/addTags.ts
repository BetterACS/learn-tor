import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'

export default function addTags(){
    return{
        addTags:publicProcedure
            .input(
                z.object({

                })
            )
            .mutation(async ({input}) => {
                
            })
    }
}