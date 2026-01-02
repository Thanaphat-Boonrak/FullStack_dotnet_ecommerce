namespace Core.Specifications;

public class ProductSpecParams
{

     private const int MaxPageSize = 50;
     public int PageNumber
     {
          get;
          set;
     } = 1;

     private int _pageSize = 6;

     public int PageSize
     {
          get => _pageSize;
          set { _pageSize = value > MaxPageSize ? MaxPageSize : value; }
     }
     
     private List<string> _brand = [];

     public List<string> Brands
     {
          get => _brand;
          set { _brand = value.SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList(); }
     }

     private List<string> _type = [];

     public List<string> Types
     {
          get => _type;
          set { _type = value.SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries)).ToList(); }
     }
     
     public string? Sort { get; set; }
     
     private string? _search;

     public string? Search
     {
          get => _search ?? "";
          set { _search = value?.ToLower(); }
     }
}