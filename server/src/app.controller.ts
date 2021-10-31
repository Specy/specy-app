import { Controller, Get, Param } from '@nestjs/common'
import { ParseIntPipe } from '@nestjs/common'

@Controller("ping")
export class AppController {
	@Get()
	ping() {
		return `pong`
	}
	@Get(':time')
	pingTimestamp(@Param('time', ParseIntPipe) time: number) {
		return `pong: ${new Date().getTime() - time}ms`
	}

}