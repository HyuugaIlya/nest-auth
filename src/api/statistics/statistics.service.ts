import { Injectable } from '@nestjs/common';
import { lookup } from 'geoip-country';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class StatisticsService {
    private readonly parser: UAParser

    constructor(private readonly prismaService: PrismaService) {
        this.parser = new UAParser()
    }

    async getBrowserStats(id: string) {
        const clicks = await this.getClicks(id)

        const stats = clicks.reduce((s, c) => {
            const { browser } = this.getBrowserByUserAgent(c.userAgent)

            if (s[browser]) {
                s[browser] += 1
            } else {
                s[browser] = 1
            }

            return s
        }, {})

        return stats
    }

    async getCountryStats(id: string) {
        const clicks = await this.getClicks(id)

        const stats = clicks.reduce((s, c) => {
            const { country } = this.getCountryByIp(c.ipAddress)

            if (s[country]) {
                s[country] += 1
            } else {
                s[country] = 1
            }

            return s
        }, {})

        return stats
    }

    private async getClicks(linkId: string) {
        const clicks = await this.prismaService.click.findMany({
            where: {
                linkId
            }
        })

        return clicks
    }

    private getBrowserByUserAgent(userAgent: string) {
        this.parser.setUA(userAgent)

        const { browser } = this.parser.getResult()

        return {
            browser: browser.name ?? ''
        }
    }

    private getCountryByIp(ip: string) {
        const geo = lookup(ip)

        return {
            //@ts-ignore
            country: geo?.name
        }
    }
}
