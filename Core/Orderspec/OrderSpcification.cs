using Core.Entities.OrderAggregate;
using Core.Specifications;

namespace Core;

public class OrderSpecification : BaseSpecification<Order>
{
    public OrderSpecification(string email) : base(x => x.BuyerEmail == email)
    {
        AddInclude(x => x.OrderItems);
        AddInclude(x => x.DeliveryMethod);
        AddOrderByDesc(x => x.OrderDate);
    }
    
    public OrderSpecification(string email,int id) : base(x => x.BuyerEmail == email && x.Id == id )
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
    }
    
    public OrderSpecification(string paymentIntentId,bool isPayment) : base(x => x.PaymentIntentId == paymentIntentId)
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
    }

    public OrderSpecification(OrderSpecParam specParam) : base(x =>
        string.IsNullOrEmpty(specParam.Status) || x.Status == parasStatus(specParam.Status))
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
        ApplyPaging(specParam.PageSize * (specParam.PageNumber - 1), specParam.PageSize);
        AddOrderByDesc(x => x.OrderDate);
    }

    public OrderSpecification(int id) : base(x => x.Id == id)
    {
        AddInclude("OrderItems");
        AddInclude("DeliveryMethod");
    }



    private static OrderStatus? parasStatus(string status)
    {
        if(Enum.TryParse<OrderStatus>(status,true,out var result)) return result;
        return null;
    }
}