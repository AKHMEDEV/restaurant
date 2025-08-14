import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { CheckAuthGuard } from 'src/guards';
import { ReviewService } from './review.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewService) {}

  @UseGuards(CheckAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a review by targetType and targetId' })
  createReview(@Req() req, @Body() dto: CreateReviewDto) {
    const userId = req.user?.id;
    return this.reviewsService.createReview(userId, dto);
  }

  @Get(':restaurantId')
  @ApiOperation({ summary: 'Get all reviews by restaurantId' })
  getRestaurantReviews(@Param('restaurantId') restaurantId: string) {
    return this.reviewsService.getByRestaurant(restaurantId);
  }
}
